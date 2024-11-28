import {
  ReferenceItem,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import styles from "./pages.module.css";

export const SidePanelPage = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  return (
    <>
      <header>
        <h1>RefNote</h1>
        <div className={styles.rowFlexBox}>
          <ResetReferenceButton />
          <ReferenceSaveButton />
        </div>
      </header>
      <main>
        <section className={styles.referenceContainer}>
          <h2>Pending Reference</h2>
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
          <h2>Saved Reference</h2>
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
