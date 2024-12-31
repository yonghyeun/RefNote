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

    chrome.runtime.onMessage.addListener(handleConvertProcessDone);
    return () => {
      chrome.runtime.onMessage.removeListener(handleConvertProcessDone);
    };
  }, []);

  return null;
};
