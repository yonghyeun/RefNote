// NotifyConvertProcessSuccess에서 사용할 이전에 사용된 referenceData의 id를 담은 배열입니다.
let prevUsedReferenceIds: number[] = [];

export const notifyConvertProcessSuccess: BackgroundMessageHandler<
  NotifyConvertProcessSuccessMessage
> = (message, sendResponse) => {
  const { data } = message;

  if (
    data.length === prevUsedReferenceIds.length &&
    data.every((id) => prevUsedReferenceIds.includes(id))
  ) {
    sendResponse({ status: "ok" });
  }

  prevUsedReferenceIds = data;

  chrome.storage.sync.get<ChromeSyncStorage>("reference", (storage) => {
    const { reference } = storage;
    const updatedReference = reference.map((referenceData) =>
      referenceData.isWritten
        ? {
            ...referenceData,
            isUsed: data.includes(referenceData.id),
          }
        : referenceData
    );

    chrome.storage.sync.set({ reference: updatedReference }, () => {
      sendResponse({ status: "ok" });
    });
  });
};
