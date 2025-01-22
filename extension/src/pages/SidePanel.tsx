import { ReferenceListWidget } from "@/widgets/reference/ui";
import {
  ConvertToReferenceButton,
  CopyReferenceListButton,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { DarkModeToggle, StorageVolumeBar } from "@/features/utils/ui";
import { UnExpectedErrorBoundary } from "./errorBoundary";
import { useEffect } from "react";
import { useChromeLocalStorage } from "@/shared/store";

export const SidePanelPage = () => {
  useEffect(() => {
    const synchronizeStore = () => {
      useChromeLocalStorage.synchronizeStore();
    };

    window.addEventListener("focus", synchronizeStore);
    return () => {
      window.removeEventListener("focus", synchronizeStore);
    };
  }, []);

  return (
    <UnExpectedErrorBoundary>
      <header className="flex flex-col gap-2 ">
        <div className="flex gap-4">
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
