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
import { DarkModeToggle, StorageVolumeBar } from "@/features/utils/ui";
import { UnExpectedErrorBoundary } from "./errorBoundary";

export const SidePanelPage = () => {
  return (
    <UnExpectedErrorBoundary>
      <header className="flex flex-col pb-2 gap-2 ">
        <div className="flex gap-4">
          <ReferenceSaveButton />
          <DarkModeToggle />
        </div>
        <StorageVolumeBar />
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
