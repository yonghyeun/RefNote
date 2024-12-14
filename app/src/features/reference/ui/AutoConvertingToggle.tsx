import { useChromeStorage, useTab } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect } from "react";
import { sendMessage } from "@/shared/lib";

export const AutoConvertingToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();
  const { autoConverting } = chromeStorage;
  const tab = useTab();

  /**
   * toggling 메소드는 url이 velog.io/write인지 확인된 경우에만 호출 되어야 합니다.
   * 해당 메소드의 존재 이유는 SPA 로 개발 된 velog 에서 content script가 적절히 삽입 되지 않은 경우
   * 에러 핸들러를 통해 스크립트를 적절히 삽입하고 다시 toggling 메소드를 호출하기 위함입니다.
   */
  const toggling = async (data: "on" | "off", tabId: number) => {
    try {
      await chrome.tabs.sendMessage(tabId, {
        message: "SetAutoConverting",
        data,
      });

      // TOOD state 를 변경하는 부분을 분리하여 중복 제거
      const prev = (await chrome.storage.sync.get(null)) as ChromeStorage;
      setChromeStorage(() => ({
        ...prev,
        autoConverting: data === "on" ? true : false,
      }));
    } catch (error) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["src/autoConverting.js"],
      });
      toggling(data, tabId);
    }
  };

  const handleToggle = () => {
    if (!tab) {
      return;
    }

    try {
      const { id, url } = tab;

      if (!id || !url) {
        throw new Error("현재 탭의 정보를 가져올 수 없습니다.");
      }

      if (!url.includes("https://velog.io/write")) {
        throw new Error(
          "자동 전환 기능은 벨로그 > 글 작성 페이지에서만 사용할 수 있습니다."
        );
      }

      toggling(autoConverting ? "off" : "on", id);
    } catch (error) {
      sendMessage({
        message: "NotifyError",
        data: (error as Error).message,
      });
    }
  };

  useEffect(() => {
    if (!tab) {
      return;
    }

    try {
      const { id, url } = tab;

      if (!id || !url) {
        throw new Error("현재 탭의 정보를 가져올 수 없습니다.");
      }

      if (!url.includes("https://velog.io/write")) {
        return;
      }

      toggling(autoConverting ? "on" : "off", id);
    } catch (error) {
      sendMessage({
        message: "NotifyError",
        data: (error as Error).message,
      });
    }
  }, [tab]);

  return (
    <label className={styles.toggleLabel}>
      <span
        className={`${styles.toggleSpan} ${autoConverting ? styles.activeSpan : styles.defaultSpan}`}
      >
        자동 변환
      </span>
      <div className={styles.toggleSwitch}>
        <input
          type="checkbox"
          className={styles.checkBox}
          checked={autoConverting}
          onChange={handleToggle}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
};
