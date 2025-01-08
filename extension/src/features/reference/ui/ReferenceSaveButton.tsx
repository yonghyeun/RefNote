import { useChromeStorage } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui/button";

// TODO : 로딩 처리 하기
export const ReferenceSaveButton = () => {
  const { setChromeStorage } = useChromeStorage();

  const handleSaveReference = async () => {
    // tabId 를 가져 옵니다.
    // 해당 tabId를 이용해 document 정보를 받아 옵니다.
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const data = {
      title: tab.title,
      url: tab.url,
      faviconUrl: tab.favIconUrl,
      isWritten: false,
    } as UnAttachedReferenceData;

    setChromeStorage((prevStorage) => ({
      ...prevStorage,
      reference: [...(prevStorage.reference || []), data],
    }));
  };

  return (
    <Button onClick={handleSaveReference} className="flex-grow">
      저장
    </Button>
  );
};
