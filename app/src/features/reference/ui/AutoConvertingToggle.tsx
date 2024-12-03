import { useChromeStorage } from "@/shared/store";
import styles from "./styles.module.css";

export const AutoConvertingToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();
  const { autoConverting } = chromeStorage;

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
