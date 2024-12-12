import { useChromeStorage } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect } from "react";
import { getVelogTab } from "../model";

export const AutoConvertingToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();
  const { autoConverting } = chromeStorage;

  const initialize = async () => {
    try {
      const tab = await getVelogTab();
      const { autoConverting } =
        await chrome.storage.sync.get("autoConverting");

      await chrome.tabs.sendMessage(tab.id, {
        message: "SetAutoConverting",
        data: autoConverting ? "on" : "off",
      });
    } catch (error) {
      await chrome.runtime.sendMessage({
        message: "NotifyError",
        data: (error as Error).message || "알 수 없는 오류가 발생하였습니다.",
      });

      const chromeStorage = (await chrome.storage.sync.get(
        null
      )) as ChromeStorage;

      setChromeStorage(() => ({
        ...chromeStorage,
        autoConverting: false,
      }));
    }
  };

  const handleToggle = async () => {
    try {
      const tab = await getVelogTab();

      await chrome.tabs.sendMessage(tab.id, {
        message: "SetAutoConverting",
        data: autoConverting ? "off" : "on",
      });

      setChromeStorage((prev) => ({
        ...prev,
        autoConverting: !autoConverting,
      }));
    } catch (error) {
      chrome.runtime.sendMessage({
        message: "NotifyError",
        data: (error as Error).message || "알 수 없는 오류가 발생하였습니다.",
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

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
