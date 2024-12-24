export const checkContentScriptInjected = (
  tabId: number,
  delay: number = 0
): Promise<{ status: string; message: string }> => {
  return new Promise((resolve, reject) => {
    if (delay >= 1000) {
      reject({
        status: "error",
        message: "아무리 기다려도 콘텐트 스크립트가 준비가 안돼요",
      });
    }

    chrome.tabs.sendMessage(tabId, { message: "KnockKnock" }, (response) => {
      const { lastError } = chrome.runtime;
      if (!lastError) {
        resolve(response);
        return;
      }
      if (
        lastError.message ===
        "Could not establish connection. Receiving end does not exist."
      ) {
        setTimeout(() => {
          resolve(checkContentScriptInjected(tabId, delay + 100));
        }, 100);
        return;
      }
      reject({
        status: "error",
        message: lastError.message,
      });
    });
  });
};
