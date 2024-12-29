export const sendMessageToTab = async <T = void, K = undefined>(
  message: RequestMessage<K>
) => {
  return new Promise<T>((resolve, reject) => {
    chrome.tabs.sendMessage<RequestMessage<K>, ResponseMessage<T>>(
      message.tab.id,
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

export const sendMessageToBackground = async <T = void, K = undefined>(
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
