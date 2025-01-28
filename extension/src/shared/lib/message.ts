const loggingError = (
  errorOriginMessage: RequestMessage,
  errorMessage: string
) => {
  console.group("error occur in message handler");
  console.group("error origin message");
  console.table(errorOriginMessage);
  console.groupEnd();
  console.trace(errorMessage);
  console.groupEnd();
};

export const sendMessageToBackground = async <Response = unknown>(
  message: RequestMessage
) => {
  return new Promise<Response>((resolve, reject) => {
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
