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

export const sendMessageToBackground = async <T = undefined, K = undefined>(
  message: RequestMessage<K>
) => {
  return new Promise<T>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError || !response) {
        reject(chrome.runtime.lastError?.message || "응답이 없습니다.");
        return;
      }
      resolve(response.data);
    });
  });
};
