import { useChromeSyncStorage } from "@/shared/store/chromeSyncStorage";
import { Button } from "@/shared/ui/button";

export const ResetReferenceButton = () => {
  const handleResetReference = () =>
    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: () => ({
        reference: [],
      }),
    });

  return (
    <Button color="danger" onClick={handleResetReference}>
      목록 초기화
    </Button>
  );
};
