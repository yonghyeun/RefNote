import {
  AttachedReferenceList,
  ConvertToReferenceButton,
  CopyReferenceListButton,
  ReferenceSaveButton,
  ResetReferenceButton,
  UnAttachedReferenceList,
} from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { AutoConvertingToggle } from "@/features/reference/ui";
import { DarkModeToggle } from "@/features/utils/ui";
import styles from "./pages.module.css";

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
          <UnAttachedReferenceList />
        </section>
        <section className={styles.referenceContainer}>
          <div
            className={styles.headerButtonContainer}
            style={{
              marginBottom: "0.5rem",
            }}
          >
            <h2>
              글에 첨부된 레퍼런스
              <span>
                ({reference.filter(({ isWritten }) => isWritten).length})
              </span>
            </h2>
            <AutoConvertingToggle />
          </div>
          <div className={styles.headerButtonContainer}>
            <CopyReferenceListButton />
          </div>
          <AttachedReferenceList />
        </section>
      </main>
      <footer className={styles.headerButtonContainer}>
        <ConvertToReferenceButton />
        <ResetReferenceButton />
      </footer>
    </>
  );
};
