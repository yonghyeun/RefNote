import browser from "webextension-polyfill";
import { openSidePanel } from "./sidePanel/model";
import {
  convertNumberToReference,
  getReferenceData,
} from "./features/reference/model";
import { type CovertToReferenceMessage } from "./features/reference/ui";

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
    /**
     * 비동기 메시지 핸들러의 경우 핸들러 응답값에 따라 response 를 보내는 고차 함수 입니다.
     */
    const handleAsyncMessage = <T extends unknown>(
      handler: () => Promise<unknown>
    ) => {
      handler()
        .then((data) => {
          sendResponse({
            message: "ok",
            tab: message.tab,
            data: data as T,
          });
        })
        .catch((error) => {
          sendResponse({
            message: error,
            tab: message.tab,
          });
        });
      return true;
    };

    switch (message.message) {
      case "openSidePanel":
        return handleAsyncMessage(() => openSidePanel(message.tab));
      case "getReferenceData":
        return handleAsyncMessage<UnAttachedReferenceData>(() =>
          getReferenceData(message.tab)
        );
      case "CovertToReference":
        return convertNumberToReference(message as CovertToReferenceMessage);
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
