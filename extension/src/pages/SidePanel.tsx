import {
  AttachedReferenceContainer,
  UnAttachedReferenceContainer,
} from "@/widgets/reference/ui";
import {
  ConvertToReferenceButton,
  CopyReferenceListButton,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { DarkModeToggle } from "@/features/utils/ui";
import { UnExpectedErrorBoundary } from "./errorBoundary";

export const SidePanelPage = () => {
  return (
    <UnExpectedErrorBoundary>
      <header className="flex justify-between items-center pb-2 gap-4 ">
        <ReferenceSaveButton />
        <DarkModeToggle />
      </header>
      <main className="flex flex-col h-full gap-2">
        <UnAttachedReferenceContainer />
        <AttachedReferenceContainer />
      </main>
      <footer className="flex justify-center items-center gap-4">
        <CopyReferenceListButton />
        <ConvertToReferenceButton />
        <ResetReferenceButton />
      </footer>
    </UnExpectedErrorBoundary>
  );
};
