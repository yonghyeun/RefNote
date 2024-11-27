import browser from "webextension-polyfill";
import { openSidePanel } from "./sidePanel/model";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener((details) => {
  if (process.env.NODE_ENV === "development") {
    console.group("browser.runtime.onInstalled");
    console.dir(details);
    console.groupEnd();

    console.group("manifest.json information");
    console.dir(browser.runtime.getManifest());
    console.groupEnd();
  }
});

chrome.runtime.onMessage.addListener(
  (message: RequestMessage, _sender, sendResponse) => {
    if (!message.tabId) {
      return;
    }

    /**
     * 비동기 메시지 핸들러의 경우 핸들러 응답값에 따라 response 를 보내는 고차 함수 입니다.
     */
    const handleAsyncMessage = (handler: () => Promise<unknown>) => {
      handler()
        .then(() => {
          sendResponse({
            message: "ok",
            tabId: message.tabId,
          });
        })
        .catch((error) => {
          sendResponse({
            message: error,
            tabId: message.tabId,
          });
        });

      return true;
    };

    switch (message.message) {
      case "openSidePanel":
        return handleAsyncMessage(() => openSidePanel(message));
      // 비동기 응답을 위해 true 반환
      default:
        throw new Error(`처리 되지 않은 메시지 입니다. ${message}`);
    }
  }
);
