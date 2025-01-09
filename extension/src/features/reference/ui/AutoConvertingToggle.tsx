import { useChromeStorage, useTab } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect } from "react";
import { isVelogWritePage } from "@/shared/lib";

export const AutoConvertingToggle = () => {
  const {
    chromeStorage: { autoConverting, isContentScriptEnabled },
    setChromeStorage,
  } = useChromeStorage();
  const tab = useTab();

  useEffect(() => {
    if (!tab) {
      return;
    }

    if (isVelogWritePage(tab) && !isContentScriptEnabled) {
      chrome.tabs.reload(tab.id);
    }
  }, [tab, isContentScriptEnabled]);

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
            setChromeStorage((prev) => ({
              ...prev,
              autoConverting: !prev.autoConverting,
            }));
          }}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
};
