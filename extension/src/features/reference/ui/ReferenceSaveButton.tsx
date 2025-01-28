import { isTab, toastMessage } from "@/shared/lib";
import { useSaveErrorUrl } from "@/shared/store";
import { useChromeSyncStorage } from "@/shared/store/chromeSyncStorage";
import { Button } from "@/shared/ui/button";

export const ReferenceSaveButton = () => {
  const reference = useChromeSyncStorage((state) => state.reference);
  const { errorUrl, setErrorUrl } = useSaveErrorUrl();

  const handleSaveReference = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!isTab(tab)) {
      toastMessage({
        toastKey: "error",
        message:
          "탭 정보가 유효하지 않아 저장에 실패했습니다. 다시 시도해 주세요",
        title: "오류",
      });
      return;
    }

    if (reference.some(({ url }) => url === tab.url)) {
      setErrorUrl(tab.url);
      return;
    }

    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: ({ reference }) => ({
        reference: reference.concat({
          title: tab.title,
          url: tab.url,
          faviconUrl: tab.favIconUrl,
          isWritten: false,
        }),
      }),
    });
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
