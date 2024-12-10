import { useChromeStorage } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect } from "react";

export const AutoConvertingToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();
  const { autoConverting } = chromeStorage;

  useEffect(() => {
    (async function () {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id || tab.url !== "https://velog.io/write") {
        const chromeStorage = (await chrome.storage.sync.get(
          null
        )) as ChromeStorage;

        setChromeStorage(() => ({
          ...chromeStorage,
          autoConverting: false,
        }));

        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/autoConverting.js"],
      });

      await chrome.tabs.sendMessage(tab.id, {
        message: "SetAutoConverting",
        data: autoConverting,
      });
    })();
  }, []);

  const handleToggle = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id || !tab.url) {
        throw new Error(
          "현재 탭 정보를 가져오는데 실패했습니다. 다시 시도해주세요"
        );
      }

      if (!tab.url.includes("https://velog.io/write")) {
        throw new Error(
          "해당 기능은 벨로그 > 글쓰기에서만 사용 가능한 기능입니다."
        );
      }

      await chrome.tabs.sendMessage(tab.id, {
        message: "SetAutoConverting",
        data: autoConverting ? "off" : "on",
      });

      setChromeStorage((prev) => ({
        ...prev,
        autoConverting: !prev.autoConverting,
      }));
    } catch (error) {
      // 이러한 경우에 대한 에러 핸들링을 해야 합니다.
      // 확장 프로그램이 지정된 경로가 아닌 곳에서 열린 후
      // 열린 채로 지정된 경로로 이동한 경우 사용 가능하지만 스크립트가 삽입 되지 않았기 때문에 에러가 발생 할 수 있습니다.

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (
        tab &&
        tab.id &&
        tab.url &&
        tab.url.includes("https://velog.io/write")
      ) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["src/autoConverting.js"],
        });
        handleToggle();
        return;
      }

      const errorMessage = (error as Error).message;

      await chrome.notifications.create(
        errorMessage,
        {
          type: "basic",
          iconUrl: "/icon/128.png",
          title: "오류 발생",
          message: errorMessage,
        },
        () => {
          // 1초 후에 해당 알림 닫히게 하기
          setTimeout(() => {
            chrome.notifications.clear(errorMessage);
          }, 1000);
        }
      );

      const chromeStorage = (await chrome.storage.sync.get(
        null
      )) as ChromeStorage;

      setChromeStorage(() => ({
        ...chromeStorage,
        autoConverting: false,
      }));
    }
  };

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
