import {
  ConvertToReferenceButton,
  CopyReferenceListButton,
  ReferenceItem,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { AutoConvertingToggle } from "@/features/reference/ui";
import styles from "./pages.module.css";
import { DarkModeToggle } from "@/features/utils/ui";

export const SidePanelPage = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  return (
    <>
      <header className={styles.headerButtonContainer}>
        <ReferenceSaveButton />
        <DarkModeToggle />
      </header>
      <main>
        <section className={styles.referenceContainer}>
          <h2>
            글에 첨부되지 않은 레퍼런스
            <span>
              ({reference.filter(({ isWritten }) => !isWritten).length})
            </span>
          </h2>
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
          <div className={styles.headerButtonContainer}>
            <h2>
              글에 첨부된 레퍼런스
              <span>
                ({reference.filter(({ isWritten }) => !isWritten).length})
              </span>
            </h2>
            <AutoConvertingToggle />
          </div>
          <div>
            <ConvertToReferenceButton />
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
      <footer className={styles.headerButtonContainer}>
        <CopyReferenceListButton />
        <ResetReferenceButton />
      </footer>
    </>
  );
};
