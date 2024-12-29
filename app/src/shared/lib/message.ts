const loggingError = <K = undefined>(
  errorOriginMessage: RequestMessage<K>,
  errorMessage: string
) => {
  console.group("error occur in message handler");
  console.group("error origin message");
  console.table(errorOriginMessage);
  console.groupEnd();
  console.trace(errorMessage);
  console.groupEnd();
};

export const sendMessageToTab = async <T = void, K = undefined>(
  message: RequestMessage<K>
) => {
  return new Promise<T>((resolve, reject) => {
    chrome.tabs.sendMessage<RequestMessage<K>, ResponseMessage<T>>(
      message.tab.id,
      message,
      (response) => {
        if (chrome.runtime.lastError || !response) {
          const errorMessage =
            chrome.runtime.lastError?.message || "응답이 없습니다.";

          loggingError(message, errorMessage);

          reject(errorMessage);
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
        const errorMessage =
          chrome.runtime.lastError?.message || "응답이 없습니다.";

        loggingError(message, errorMessage);

        reject(errorMessage);
        return;
      }
      resolve(response.data);
    });
  });
};
