import browser from "webextension-polyfill";
import { openSidePanel } from "./sidePanel/model";
import {
  convertToMarkdown,
  getReferenceData,
} from "./features/reference/model";
import { ConvertToMarkdownButton } from "./features/reference/ui";

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
            message: "ok",
            tabId: message.tabId,
            data,
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
        return handleAsyncMessage(() => openSidePanel(message.tabId));
      case "getReferenceData":
        return handleAsyncMessage(() => getReferenceData(message.tabId));
      case "convertToMarkdown":
        return handleAsyncMessage(async () =>
          convertToMarkdown(
            message.tabId,
            message.data as WrittenReferenceData[]
          )
        );
      default:
        if (process.env.NODE_ENV === "development") {
          throw new Error(`처리 되지 않은 메시지 입니다. ${message.message}`);
        }
        return message.message as never;
    }
  }
);

chrome.action.onClicked.addListener((tab) => {
  if (tab.id !== undefined) {
    openSidePanel(tab.id);
  }
});
