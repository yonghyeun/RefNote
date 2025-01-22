import { useChromeSyncStorage } from "@/shared/store";
import styles from "./styles.module.css";
import { useEffect } from "react";

export const DarkModeToggle = () => {
  const isDarkMode = useChromeSyncStorage((state) => state.isDarkMode);

  const handleToggle = () => {
    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: ({ isDarkMode }) => ({
        isDarkMode: !isDarkMode,
      }),
    });
  };

  useEffect(() => {
    if (isDarkMode === undefined) {
      return;
    }

    const html = document.querySelector("html")!;
    html.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <label className={styles.toggleLabel}>
      <div className={styles.toggleSwitch}>
        <input
          type="checkbox"
          className={styles.checkBox}
          checked={!isDarkMode}
          onChange={handleToggle}
        />
        <span className={styles.toggleSlider} />
      </div>
    </label>
  );
};
