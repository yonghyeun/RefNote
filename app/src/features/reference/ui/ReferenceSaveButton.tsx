import { Button } from "@/shared/ui";
import { getCurrentTab } from "@/shared/model";

// TODO : 로딩 처리 하기
export const ReferenceSaveButton = () => {
  const handleSaveReference = async () => {
    const tab = await getCurrentTab();
    chrome.runtime.sendMessage({
      message: "saveReference",
      tabId: tab?.id,
    });
  };

  return <Button onClick={handleSaveReference}>Save Reference</Button>;
};
