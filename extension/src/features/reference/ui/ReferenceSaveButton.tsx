import { isTab, sendMessageToBackground } from "@/shared/lib";
import { useSaveErrorUrl } from "@/shared/store";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui/button";

// TODO : 로딩 처리 하기
export const ReferenceSaveButton = () => {
  const {
    chromeStorage: { reference },
    setChromeStorage,
  } = useChromeStorage();
  const { errorUrl, setErrorUrl } = useSaveErrorUrl();

  const handleSaveReference = async () => {
    // tabId 를 가져 옵니다.
    // 해당 tabId를 이용해 document 정보를 받아 옵니다.
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!isTab(tab)) {
      sendMessageToBackground({
        message: "NotifyError",
        data: "탭 정보가 유효하지 않아 저장에 실패했습니다. 다시 시도해 주세요",
      });
      return;
    }

    if (reference.some(({ url }) => url === tab.url)) {
      setErrorUrl(tab.url);
      return;
    }

    const data: UnAttachedReferenceData = {
      title: tab.title,
      url: tab.url,
      faviconUrl: tab.favIconUrl,
      isWritten: false,
    };

    setChromeStorage((prevStorage) => ({
      ...prevStorage,
      reference: [...prevStorage.reference, data],
    }));
  };

  return (
    <Button
      onClick={handleSaveReference}
      className="flex-grow"
      color={errorUrl ? "danger" : "primary"}
    >
      {errorUrl ? "이미 저장된 페이지가 존재합니다" : "저장"}
    </Button>
  );
};
