import { useChromeStorage } from "@/shared/store";
import { useEffect, useState } from "react";

export const ReferenceMessageHandler = () => {
  const { setChromeStorage } = useChromeStorage();
  const [prevUsedReferenceIds, setPrevUsedReferenceIds] = useState<number[]>(
    []
  );

  useEffect(() => {
    /**
     * 해당 메시지 리스너는 벨로그 글쓰기 페이지에서 ConvertReference가 시행 된 후
     * 현재 코드미러 인스턴스의 글에서 사용된 referenceData의 id를 받아와
     * chrome.storage.sync에서 AttachedReferenceData의 isUsed를 true로 변경하는 역할입니다.
     */
    const handleConvertProcessDone = ({
      message,
      data,
    }: RequestMessage<number[]>) => {
      if (message === "NotifyConvertProcessSuccess") {
        if (JSON.stringify(prevUsedReferenceIds) === JSON.stringify(data)) {
          return;
        }
        setPrevUsedReferenceIds(data);

        setChromeStorage(({ reference, ...rest }) => {
          return {
            ...rest,
            reference: reference.map((referenceData) => {
              if (referenceData.isWritten) {
                return {
                  ...referenceData,
                  isUsed: data.includes(referenceData.id),
                };
              }
              return referenceData;
            }),
          };
        });
      }
    };
    /**
     * 해당 메시지 리스너는 autoConverting.ts 가 삽입 된 후 글에 이미 작성 되어 있는 referenceData의 정보를 가져와
     * chrome.storage.sync에 저장하는 역할을 합니다.
     * 이 때 기존 attachedReferenceData의 데이터는 모두 unAttachedReferenceData로 변경됩니다.
     */
    const handleUpdateAttachedReferenceData = (
      { message, data }: RequestMessage<AttachedReferenceData[]>,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response: ResponseMessage) => void
    ) => {
      if (message === "UpdateAttachedReferenceData") {
        setChromeStorage((prev) => {
          const { reference, ...rest } = prev;

          // 업데이트 할 때에는 모든 데이터를 unAttachedReferenceData로 변경합니다.

          const updatedPrevReferenceData: UnAttachedReferenceData[] = reference
                .filter(({ url }) =>
                  data.every(({ url: dataUrl }) => url !== dataUrl)
                )
            .map(({ title, url, faviconUrl }) => ({
              title,
              url,
              faviconUrl,
                  isWritten: false,
            }));

          return {
            ...rest,
            reference: [...updatedPrevReferenceData, ...data],
          };
        });

        sendResponse({
          status: "ok",
          data: null,
        });
      }
    };
    chrome.runtime.onMessage.addListener(handleConvertProcessDone);
    chrome.runtime.onMessage.addListener(handleUpdateAttachedReferenceData);
    return () => {
      chrome.runtime.onMessage.removeListener(handleConvertProcessDone);
      chrome.runtime.onMessage.removeListener(
        handleUpdateAttachedReferenceData
      );
    };
  }, []);

  return null;
};
