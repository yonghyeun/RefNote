import { useChromeStorage, useTab } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

export const AutoConvertingToggle = () => {
  const {
    chromeStorage: { autoConverting, isContentScriptEnabled },
    setChromeStorage,
  } = useChromeStorage();
  const tab = useTab();
  const [isAutoConvertingDisabled, setIsAutoConvertingDisabled] =
    useState<boolean>(false);

  useEffect(() => {
    if (!tab) {
      return;
    }

    if (tab.url.includes("https://velog.io/write") && !isContentScriptEnabled) {
      setIsAutoConvertingDisabled(true);
      setChromeStorage((prev) => ({
        ...prev,
        autoConverting: false,
      }));
      return;
    }

    setIsAutoConvertingDisabled(false);
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
          disabled={isAutoConvertingDisabled}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
};
