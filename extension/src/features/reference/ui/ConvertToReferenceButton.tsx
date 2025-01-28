import { Button } from "@/shared/ui/button";
import { useChromeSyncStorage, useTab } from "@/shared/store";
import { isVelogWritePage, sendMessageToBackground } from "@/shared/lib";

export const ConvertToReferenceButton = () => {
  const isContentScriptEnabled = useChromeSyncStorage(
    (state) => state.isContentScriptEnabled
  );
  const tab = useTab();

  const handleClick = async () => {
    if (!tab) {
      return;
    }

    try {
      const attachedReferenceList = await sendMessageToBackground<
        AttachedReferenceData["id"][]
      >({
        message: "ConvertToReference",
        tab,
      });

      sendMessageToBackground({
        message: "NotifyConvertProcessSuccess",
        data: attachedReferenceList,
        tab,
      });
    } catch (error) {
      sendMessageToBackground({
        message: "NotifyError",
        data: (error as Error).message,
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex-grow"
      disabled={!(isVelogWritePage(tab) && isContentScriptEnabled)}
    >
      텍스트 변환
    </Button>
  );
};
