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

      // autoConvertingToggle이 마운트 된 이후 autoConverting 스크립트를 삽입합니다.

      if (!tab || !tab.id || tab.url !== "https://velog.io/write") {
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["autoConverting.ts"],
      });
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        return;
      }
      try {
        await chrome.tabs.sendMessage(tab.id, {
          message: "SetAutoConverting",
          data: autoConverting ? "on" : "off",
        });
        console.log("toggle", {
          message: "SetAutoConverting",
          data: autoConverting ? "on" : "off",
        });
      } catch (e) {
        // content script 가 로드 되기 전에 메시지가 보내지는 경우가 있다.
        // 이에 우선 에러 처리를 캐치만 해두도록 하고 나중에 어떻게 변환할지 생각해보자
        console.error(e);
      }
    })();
  }, [autoConverting]);

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
          onChange={() => {
            setChromeStorage((prev) => {
              return {
                ...prev,
                autoConverting: !prev.autoConverting,
              };
            });
          }}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
};
