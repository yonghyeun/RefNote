import {
  CopyReferenceListButton,
  ReferenceItem,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import styles from "./pages.module.css";
import { IsMarkdownToggle } from "@/features/reference/ui/IsMarkdownToggle";

export const SidePanelPage = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  return (
    <>
      <header>
        <h1>RefNote</h1>
        <div className={styles.headerButtonContainer}>
          <ReferenceSaveButton />
          <IsMarkdownToggle />
        </div>
      </header>
      <main>
        <section className={styles.referenceContainer}>
          <h2>UnAttached References</h2>
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
          <h2>Attached References</h2>
          <div>
            <CopyReferenceListButton />
          </div>
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
      <footer>
        <ResetReferenceButton />
      </footer>
    </>
  );
};
