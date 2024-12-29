import { useChromeStorage, useTab } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect } from "react";

export const AutoConvertingToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();
  const tab = useTab();

  const toggling = (id: Tab["id"], autoConverting: boolean, retry: boolean) => {
    chrome.tabs.sendMessage(
      id,
      {
        message: "SetAutoConverting",
        data: autoConverting ? "on" : "off",
      },
      () => {
        if (chrome.runtime.lastError) {
          if (retry) {
            setTimeout(() => {
              toggling(id, autoConverting, false);
            }, 500);
            return;
          }

          chrome.runtime.sendMessage({
            message: "NotifyError",
            data: "자동 변환기능에 사용 할 삽입 될 콘텐트 스크립트를 찾지 못했습니다. 새로고침 후 이용해 주세요",
          });

          setChromeStorage((prev) => ({
            ...prev,
            autoConverting: false,
          }));
          return;
        }

        if (autoConverting !== chromeStorage.autoConverting) {
          setChromeStorage((prev) => ({
            ...prev,
            autoConverting,
          }));
        }
      }
    );
  };

  const handleToggle = () => {
    if (!tab) {
      return;
    }

    if (!tab.url.includes("https://velog.io/write")) {
      chrome.runtime.sendMessage({
        message: "NotifyError",
        data: "자동 전환 기능은 Velog 글쓰기 페이지에서만 사용 가능합니다.",
      });
      return;
    }
    toggling(tab.id, !chromeStorage.autoConverting, true);
  };

  useEffect(() => {
    (async () => {
      if (!tab || !tab.url.includes("https://velog.io/write")) {
        return;
      }

      const { autoConverting } =
        await chrome.storage.sync.get("autoConverting");
      toggling(tab.id, autoConverting, false);
    })();
  }, [tab]);

  return (
    <label className={styles.toggleLabel}>
      <span
        className={`${styles.toggleSpan} ${chromeStorage.autoConverting ? styles.activeSpan : styles.defaultSpan}`}
      >
        자동 변환
      </span>
      <div className={styles.toggleSwitch}>
        <input
          type="checkbox"
          className={styles.checkBox}
          checked={chromeStorage.autoConverting}
          onChange={handleToggle}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
};
