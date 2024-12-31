import { useChromeStorage } from "@/shared/store";
import styles from "./styles.module.css";

export const AutoConvertingToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();

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
