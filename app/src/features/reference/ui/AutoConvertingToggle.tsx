import { useChromeStorage } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

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

      if (!tab || !tab.id) {
        throw new Error(
          "현재 탭 정보를 가져오는데 실패했습니다. 다시 시도해주세요"
        );
      }

      if (tab.url !== "https://velog.io/write") {
        throw new Error(
          "해당 기능은 벨로그 > 글쓰기에서만 사용 가능한 기능입니다."
        );
      }

      await chrome.tabs.sendMessage(tab.id, {
        message: "SetAutoConverting",
        data: autoConverting ? "on" : "off",
      });

      setChromeStorage((prev) => ({
        ...prev,
        autoConverting: !prev.autoConverting,
      }));
    } catch (error) {
      // TODO 알림 처리 하기
      console.error(error);
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
