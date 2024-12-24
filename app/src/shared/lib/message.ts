export const sendMessageToTab = async <T = undefined>(
  tabId: number,
  message: { message: string }
) => {
  return new Promise<T>((resolve, reject) => {
    chrome.tabs.sendMessage<{ message: string }, ResponseMessage<T>>(
      tabId,
      message,
      (response) => {
        if (chrome.runtime.lastError || !response) {
          reject(chrome.runtime.lastError?.message || "응답이 없습니다.");
          return;
        }
        resolve(response.data);
      }
    );
  });
};
