import {
  ConvertToReferenceButton,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { DarkModeToggle } from "@/features/utils/ui";
import styles from "./pages.module.css";
import {
  AttachedReferenceContainer,
  UnAttachedReferenceContainer,
} from "@/widgets/reference/ui";

export const SidePanelPage = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  const unAttachedReferenceList = reference.filter(
    (data): data is UnAttachedReferenceData => !data.isWritten
  );

  const attachedReferenceList = reference.filter(
    (data): data is AttachedReferenceData => data.isWritten
  );

  return (
    <>
      <header className={styles.buttonContainer}>
        <ReferenceSaveButton />
        <DarkModeToggle />
      </header>
      <main>
        <UnAttachedReferenceContainer
          unAttachedReferenceList={unAttachedReferenceList}
        />
        <AttachedReferenceContainer
          attachedReferenceList={attachedReferenceList}
        />
      </main>
      <footer className={styles.buttonContainer}>
        <ConvertToReferenceButton />
        <ResetReferenceButton />
      </footer>
    </>
  );
};
