import { sendMessage } from "@/shared/lib";
import { getCurrentTab } from "@/shared/model";
import { useChromeStorage } from "@/shared/store";
import { Button } from "@/shared/ui/button";

export interface CovertToReferenceMessage {
  message: "CovertToReference";
  tab: Tab;
  data: ReferenceData[];
}

export const ConvertToReferenceButton = () => {
  const { chromeStorage } = useChromeStorage();
  const { isMarkdown, reference } = chromeStorage;

  const handleCovertToReference = async () => {
    const tab = await getCurrentTab();

    await sendMessage({
      message: "CovertToReference",
      tab,
      data: reference,
    });
  };

  return (
    <Button disabled={!isMarkdown} onClick={handleCovertToReference}>
      Convert Reference !
    </Button>
  );
};
