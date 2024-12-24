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

    chrome.runtime.onMessage.addListener(handleConvertProcessDone);
    return () => {
      chrome.runtime.onMessage.removeListener(handleConvertProcessDone);
    };
  }, []);

  /**
   * 해당 이펙트는 벨로그 글 쓰기 페이지에서 콘텐트 스크립트에게 보내는
   * 메시지들을 담고 있습니다.
   *
   * 다뤄지는 로직
   * 1. ParseUsedReferenceData 메시지를 보내어 사용된 referenceData를 파싱합니다.
   * 이 때 사용 된 데이터가 존재하지 않는 경우엔 기존 AttachedReferenceData의 isUsed를 false로 변경합니다.
   * 만약 사용 된 데이터가 존재 한다면 해당 데이터들을 AttachedReferenceData로, 기존의 AttachedReferenceData는 UnAttachedReferenceData로 변경합니다.
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
