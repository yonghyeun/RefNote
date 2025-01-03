import {
  ConvertToReferenceButton,
  ReferenceSaveButton,
  ResetReferenceButton,
} from "@/features/reference/ui";
import { DarkModeToggle } from "@/features/utils/ui";
import {
  AttachedReferenceContainer,
  UnAttachedReferenceContainer,
} from "@/widgets/reference/ui";

export const SidePanelPage = () => {
  return (
    <>
      <header className="flex justify-between items-center pb-2 border-b-[1px] gap-4 border-gray-200">
        <ReferenceSaveButton />
        <DarkModeToggle />
      </header>
      <main className="flex flex-col h-full gap-2">
        <UnAttachedReferenceContainer />
        <AttachedReferenceContainer />
      </main>
      <footer className="flex justify-center items-center gap-4">
        <ConvertToReferenceButton />
        <ResetReferenceButton />
      </footer>
    </>
  );
};
