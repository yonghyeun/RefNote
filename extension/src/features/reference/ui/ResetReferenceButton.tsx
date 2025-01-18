import { useChromeStorage } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui/button";

export const ResetReferenceButton = () => {
  const setChromeStorage = useChromeStorage.setState;

  const handleResetReference = () => {
    setChromeStorage((prev) => ({
      ...prev,
      reference: [],
    }));
  };

  return (
    <Button color="danger" onClick={handleResetReference}>
      목록 초기화
    </Button>
  );
};
