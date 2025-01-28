import browser from "webextension-polyfill";
import {
  convertNumberToReference,
  notifyConvertProcessSuccess,
} from "./features/reference/model";
import { chromeSyncStorageInitialValue } from "./shared/store";

browser.runtime.onInstalled.addListener(async (details) => {
  if (process.env.NODE_ENV === "development") {
    console.group("browser.runtime.onInstalled");
    console.dir(details);
    console.groupEnd();

    console.group("manifest.json information");
    console.dir(browser.runtime.getManifest());
    console.groupEnd();
  }

  // runtime.onInstalled 이벤트는 설치, 확장 프로그램 혹은 구글 크롬 업데이트 시 발생합니다.
  // 이에 이전에 존재하던 스토리지 값과 기본 값을 이용해 크롬스토리지를 초기화합니다.

  const prevStorageValue = await chrome.storage.sync.get(null);
  chrome.storage.sync.set({
    ...chromeSyncStorageInitialValue,
    ...prevStorageValue,
  });
});

const notifyError: BackgroundMessageHandler<NotifyErrorMessage> = (
  { data },
  sendResponse
) => {
  chrome.notifications.create(
    "alarm",
    {
      type: "basic",
      iconUrl: "/icon/128.png",
      title: "오류",
      message: data,
      silent: true,
    },
    () => {
      const { lastError } = chrome.runtime;
      sendResponse({
        status: lastError ? "error" : "ok",
        data: lastError ? lastError.message : null,
      });
      setTimeout(() => {
        chrome.notifications.clear("alarm");
      }, 3000);
    }
  );
};

chrome.runtime.onMessage.addListener(
  (message: RequestMessage, sender, sendResponse) => {
    switch (message.message) {
      case "ConvertToReference":
        convertNumberToReference(
          {
            ...message,
            tab: sender.tab as Tab,
          },
          sendResponse
        );
        break;
      case "NotifyError":
        notifyError(message, sendResponse);
        break;
      case "NotifyConvertProcessSuccess":
        notifyConvertProcessSuccess(message, sendResponse);
        break;
      default:
        break;
    }
    return true;
  }
);

const openSidePanel = async (tab: chrome.tabs.Tab) => {
  try {
    if (!tab || !tab.id || !tab.url) {
      throw new Error("현재 탭 정보를 가져올 수 없습니다.");
    }

    await chrome.sidePanel.open({
      tabId: tab.id,
    });
    await chrome.sidePanel.setOptions({
      enabled: true,
      path: "src/index.html",
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
};

chrome.action.onClicked.addListener(openSidePanel);
