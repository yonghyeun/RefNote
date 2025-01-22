import { ReferenceListWidget } from "@/widgets/reference/ui";
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
      <header className="flex flex-col gap-2 ">
        <div className="flex gap-2">
          <ReferenceSaveButton />
          <DarkModeToggle />
        </div>
        <StorageVolumeBar />
      </header>
      <main className="flex flex-col h-full gap-2">
        <ReferenceListWidget />
      </main>
      <footer className="flex justify-center items-center gap-4">
        <CopyReferenceListButton />
        <ConvertToReferenceButton />
        <ResetReferenceButton />
      </footer>
    </UnExpectedErrorBoundary>
  );
};
