import { useChromeSyncStorage, useTab } from "@/shared/store";
import styles from "./styles.module.css";
import { memo, useEffect } from "react";
import { isVelogWritePage } from "@/shared/lib";

export const AutoConvertingToggle = memo(() => {
  const autoConverting = useChromeSyncStorage((state) => state.autoConverting);
  const isContentScriptEnabled = useChromeSyncStorage(
    (state) => state.isContentScriptEnabled
  );

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
            useChromeSyncStorage.dispatchAction({
              type: "set",
              setter: (state) => ({
                ...state,
                autoConverting: !autoConverting,
              }),
            });
          }}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
});
