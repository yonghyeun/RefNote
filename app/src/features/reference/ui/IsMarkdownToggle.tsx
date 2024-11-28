import { useChromeStorage } from "@/shared/store";
import styles from "./styles.module.css";

export const IsMarkdownToggle = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();

  return (
    <label className={styles.toggleSwitch}>
      <input
        type="checkbox"
        className={styles.checkBox}
        checked={chromeStorage.isMarkdown}
        onChange={() => {
          setChromeStorage((prev) => {
            return {
              ...prev,
              isMarkdown: !prev.isMarkdown,
            };
          });
        }}
      />
      <span className={styles.toggleSlider} />
    </label>
  );
};
