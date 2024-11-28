import { ReferenceItem, ReferenceSaveButton } from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui";
import styles from "./pages.module.css";

export const SidePanelPage = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

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
    <>
      <header>
        <h1>RefNote</h1>
        <div className={styles.rowFlexBox}>
          <ReferenceSaveButton />
        </div>
      </header>
      <main>
        <section className={styles.referenceContainer}>
          <h2>UnWritten Reference</h2>
          <ul>
            {reference
              .filter((data): data is UnWrittenReferenceData => !data.isWritten)
              .map((reference, idx) => (
                <li key={idx}>
                  <ReferenceItem {...reference} />
                </li>
              ))}
          </ul>
        </section>
        <section className={styles.referenceContainer}>
          <h2>Written Reference</h2>
          <ul>
            {reference
              .filter((data): data is WrittenReferenceData => data.isWritten)
              .sort((prev, cur) => prev.id - cur.id)
              .map((reference, idx) => (
                <li key={idx}>
                  <ReferenceItem {...reference} />
                </li>
              ))}
          </ul>
        </section>
      </main>
    </>
  );
};
