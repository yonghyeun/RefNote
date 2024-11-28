import { sendMessage } from "@/shared/lib";
import { getCurrentTab } from "@/shared/model";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui";

// TODO : 로딩 처리 하기
export const ReferenceSaveButton = () => {
  const { setChromeStorage } = useChromeStorage();

  const handleSaveReference = async () => {
    // tabId 를 가져 옵니다.
    const tab = await getCurrentTab();
    // 해당 tabId를 이용해 document 정보를 받아 옵니다.
    const referenceData = await sendMessage<UnPickedReferenceData>({
      message: "getReferenceData",
      tabId: tab.id,
    });

    setChromeStorage((prevStorage) => ({
      ...prevStorage,
      reference: [...(prevStorage.reference || []), referenceData],
    }));
  };

  return <Button onClick={handleSaveReference}>Save Reference</Button>;
};
