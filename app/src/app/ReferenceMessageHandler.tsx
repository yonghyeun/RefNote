import { useChromeStorage, useTab } from "@/shared/store";
import { useEffect, useState } from "react";
import { sendMessageToTab } from "@/shared/lib";

export const ReferenceMessageHandler = () => {
  const { chromeStorage, setChromeStorage } = useChromeStorage();
  const [prevUsedReferenceIds, setPrevUsedReferenceIds] = useState<number[]>(
    []
  );
  const { reference } = chromeStorage;

  const tab = useTab();

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
    chrome.runtime.onMessage.addListener(handleConvertProcessDone);
    return () => {
      chrome.runtime.onMessage.removeListener(handleConvertProcessDone);
    };
  }, []);

  /**
   * 해당 이펙트는 벨로그 글 쓰기 페이지에서 콘텐트 스크립트에게 보내는
   * 메시지들을 담고 있습니다.
   */
  useEffect(() => {
    (async function () {
      if (!tab || !tab.url.includes("https://velog.io/write")) {
        return;
      }

      const sendParseUsedReferenceData = () =>
        sendMessageToTab<AttachedReferenceData[]>(tab.id, {
          message: "ParseUsedReferenceData",
        });

      const attachedReferenceList = reference.filter((data) => data.isWritten);

      let data: AttachedReferenceData[] = [];
      try {
        data = await sendParseUsedReferenceData();
      } catch (error) {
        try {
          data = await new Promise<AttachedReferenceData[]>((resolve) => {
            setTimeout(() => sendParseUsedReferenceData().then(resolve), 500);
          });
        } catch (error) {
          chrome.runtime.sendMessage({
            message: "NotifyError",
            data: (error as Error).message,
          });
        }
      } finally {
        if (data.length === 0) {
          if (attachedReferenceList.every((reference) => !reference.isUsed)) {
            return;
          }
          setChromeStorage(({ reference, ...rest }) => {
            return {
              ...rest,
              reference: reference.map((referenceData) =>
                referenceData.isWritten
                  ? { ...referenceData, isUsed: false }
                  : referenceData
              ),
            };
          });
          return;
        }

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
      }
    })();
  }, [tab]);

  return null;
};
