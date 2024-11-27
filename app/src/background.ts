import browser from "webextension-polyfill";
import { openSidePanel } from "./sidePanel/model";
import { saveReferenceOnTab } from "./features/reference/model";

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
        .then((data) => {
          sendResponse({
            message: data,
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
      case "saveReference":
        return handleAsyncMessage(() => saveReferenceOnTab(message.tabId));
      default:
        if (process.env.NODE_ENV === "development") {
          throw new Error(`처리 되지 않은 메시지 입니다. ${message.message}`);
        }
        return message.message as never;
    }
  }
);

// chrome.storage.onChanged 이벤트는 storage에 저장된 데이터가 변경될 때 발생합니다.
// 이 때 change 객체에 변경된 데이터가 포함되어 있습니다.
// areaName 은 변경된 storage의 이름이며, changes는 변경된 데이터를 포함합니다.
chrome.storage.onChanged.addListener((change, areaName) => {
  if (process.env.NODE_ENV === "development") {
    console.group(`chrome.storage.onChanged at ${areaName}`);
    console.dir(change);
    console.groupEnd();
  }
});
