import { ReferenceSaveButton } from "@/features/reference/ui";
import styles from "./pages.module.css";
import { Button } from "@/shared/ui";

export const Popup = () => {
  const handleOpenSidePanel = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) {
      return;
    }

    chrome.runtime.sendMessage({ message: "openSidePanel", tabId: tab.id });
  };

  return (
    <div>
      <h1>Popup</h1>
      <p>Popup page content</p>
      <div className={styles.rowFlexBox}>
        <Button onClick={handleOpenSidePanel}>Open Side Panel</Button>
        <ReferenceSaveButton />
      </div>
    </div>
  );
};
