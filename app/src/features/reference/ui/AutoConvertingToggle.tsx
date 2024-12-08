import { useChromeStorage } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

export const AutoConvertingToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();
  const { autoConverting } = chromeStorage;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

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
        files: ["src/autoConverting.js"],
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
      } catch (e) {
        // 에러가 나는 경우에는 스크립트가 삽입되지 않은 경우, 즉 올바른 경로가 아닌 곳에서 autoConvertingToggle을 누른 경우입니다.
        // 이 때는 해당 버튼을 disabled 상태로 만들어 오류가 발생하지 않도록 합니다.

        setIsDisabled(true);
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
          disabled={isDisabled}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
};
