import browser from "webextension-polyfill";
import { openSidePanel } from "./sidePanel/model";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
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
    };

    switch (message.message) {
      case "openSidePanel":
        handleAsyncMessage(() => openSidePanel(message));
        // 비동기 응답을 위해 true 반환
        return true;
      default:
        throw new Error(`처리 되지 않은 메시지 입니다. ${message}`);
    }
  }
);
