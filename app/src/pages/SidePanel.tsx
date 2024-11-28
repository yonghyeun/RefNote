import { ReferenceItem, ReferenceSaveButton } from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui";
import styles from "./pages.module.css";

export const SidePanelPage = () => {
  const { chromeStorage } = useChromeStorage();

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
      <h1>SidePanel</h1>
      <p>SidePanel page content</p>
      <div className={styles.rowFlexBox}>
        <Button onClick={handleOpenSidePanel}>Open Side Panel</Button>
        <ReferenceSaveButton />
      </div>
      <main>
        <h2>References</h2>
        <ul>
          {chromeStorage.reference.map((reference, idx) => (
            <li key={idx}>
              <ReferenceItem {...reference} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};
