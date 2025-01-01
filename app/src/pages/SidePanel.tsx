import {
  ConvertToReferenceButton,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { DarkModeToggle } from "@/features/utils/ui";
import styles from "./pages.module.css";
import {
  AttachedReferenceContainer,
  UnAttachedReferenceContainer,
} from "@/widgets/reference/ui";

export const SidePanelPage = () => {
  return (
    <>
      <header className={styles.buttonContainer}>
        <ReferenceSaveButton />
        <DarkModeToggle />
      </header>
      <main>
        <UnAttachedReferenceContainer />
        <AttachedReferenceContainer />
      </main>
      <footer className={styles.buttonContainer}>
        <ConvertToReferenceButton />
        <ResetReferenceButton />
      </footer>
    </>
  );
};
