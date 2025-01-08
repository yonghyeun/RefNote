import { useChromeStorage } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui/button";

export const ResetReferenceButton = () => {
  const { setChromeStorage } = useChromeStorage();
  const handleResetReference = () => {
    setChromeStorage((prev) => ({
      ...prev,
      reference: [],
    }));
  };

  return (
    <Button
      aria-label="Reset reference"
      className={`bg-red text-text border-none font-medium px-4 py-2 text-center no-underline inline-block cursor-pointer
        hover:bg-red-hover hover:text-text-hover
        focus-visible:bg-red-hover focus-visible:text-text-hover
        active:bg-red-active active:text-text-hover
        disabled:pointer-events-none disabled:bg-red-disabled disabled:text-text-disabled`}
      onClick={handleResetReference}
    >
      목록 초기화
    </Button>
  );
};
