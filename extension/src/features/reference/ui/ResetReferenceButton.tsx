import { useChromeSyncStorage } from "@/shared/store/chromeSyncStorage";
import { Button } from "@/shared/ui/button";

export const ResetReferenceButton = () => {
  const setChromeStorage = useChromeSyncStorage.setState;

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
