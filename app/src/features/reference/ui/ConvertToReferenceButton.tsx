import { sendMessage } from "@/shared/lib";
import { getCurrentTab } from "@/shared/model";
import { Button } from "@/shared/ui/button";

export interface CovertToReferenceMessage {
  message: "CovertToReference";
  tab: Tab;
  data: ReferenceData[];
}

export const ConvertToReferenceButton = () => {
  const handleCovertToReference = async () => {
    const tab = await getCurrentTab();

    await sendMessage({
      message: "CovertToReference",
      tab,
    });
  };

  return <Button onClick={handleCovertToReference}>Convert Reference !</Button>;
};
