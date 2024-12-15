import browser from "webextension-polyfill";
import { convertNumberToReference } from "./features/reference/model";

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

const notifyError = (message: string) => {
  chrome.notifications.create(
    "alarm",
    {
      type: "basic",
      iconUrl: "/icon/128.png",
      title: "오류",
      message: message,
      silent: true,
    },
    () => {
      setTimeout(() => {
        chrome.notifications.clear("alarm");
      }, 3000);
    }
  );
};

chrome.runtime.onMessage.addListener(
  (message: RequestMessage, _sender, sendResponse) => {
    /**
     * 비동기 메시지 핸들러의 경우 핸들러 응답값에 따라 response 를 보내는 고차 함수 입니다.
     */

    switch (message.message) {
      case "ConvertToReference":
        convertNumberToReference(sendResponse);
        break;
      case "NotifyError":
        notifyError(message.data as string);
        break;
      default:
        notifyError(
          "준비하지 못한 메시지가 발생했습니다. 리뷰를 남겨 개발자를 혼내주세요"
        );
        break;
    }
    return true;
  }
);

chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab || !tab.id || !tab.url) {
      throw new Error("현재 탭 정보를 가져올 수 없습니다.");
    }

    await chrome.sidePanel.open({
      tabId: tab.id,
    });
    await chrome.sidePanel.setOptions({
      enabled: true,
      path: "src/side_panel.html",
      tabId: tab.id,
    });
  } catch (error) {
    chrome.notifications.create(
      "alarm",
      {
        type: "basic",
        iconUrl: "/icon/128.png",
        title: "오류",
        message: (error as Error).message,
        silent: true,
      },
      () => {
        setTimeout(() => {
          chrome.notifications.clear("alarm");
        }, 3000);
      }
    );
  }
});
