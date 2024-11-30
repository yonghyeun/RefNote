import {
  ConvertToMarkdownButton,
  CopyReferenceListButton,
  ReferenceItem,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { IsMarkdownToggle } from "@/features/reference/ui/IsMarkdownToggle";
import styles from "./pages.module.css";

export const SidePanelPage = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  return (
    <>
      <header className={styles.headerButtonContainer}>
        <ReferenceSaveButton />
        <IsMarkdownToggle />
      </header>
      <main>
        <section className={styles.referenceContainer}>
          <h2>UnAttached References</h2>
          <ul>
            {reference
              .filter(
                (data): data is UnAttachedReferenceData => !data.isWritten
              )
              .map((reference, idx) => (
                <li key={idx}>
                  <ReferenceItem {...reference} />
                </li>
              ))}
          </ul>
        </section>
        <section className={styles.referenceContainer}>
          <h2>Attached References</h2>
          <div className={styles.headerButtonContainer}>
            <CopyReferenceListButton />
            <ConvertToMarkdownButton />
          </div>
          <ul>
            {reference
              .filter((data): data is AttachedReferenceData => data.isWritten)
              .sort((prev, cur) => prev.id - cur.id)
              .map((reference, idx) => (
                <li key={idx}>
                  <ReferenceItem {...reference} />
                </li>
              ))}
          </ul>
        </section>
      </main>
      <footer>
        <ResetReferenceButton />
      </footer>
    </>
  );
};
