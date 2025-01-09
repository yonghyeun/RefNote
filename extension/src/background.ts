import browser from "webextension-polyfill";
import { convertNumberToReference } from "./features/reference/model";
import { chromeStorageInitialValue } from "./shared/store";
import { isTab } from "./shared/lib";

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
    ...chromeStorageInitialValue,
    ...prevStorageValue,
  });
});

const notifyError = (
  message: string,
  sendResponse: (response: any) => void
) => {
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

// NotifyConvertProcessSuccess에서 사용할 이전에 사용된 referenceData의 id를 담은 배열입니다.
let prevUsedReferenceIds: number[] = [];

chrome.runtime.onMessage.addListener(
  (message: RequestMessage<unknown>, sender, sendResponse) => {
    const tab = sender.tab || message.tab;

    if (!isTab(tab)) {
      notifyError(
        "탭의 정보가 유효하지 않습니다. 다시 시도해 주세요",
        sendResponse
      );
      return true;
    }

    switch (message.message) {
      case "ConvertToReference":
        convertNumberToReference(tab, sendResponse);
        break;
      case "NotifyError":
        notifyError(message.data as string, sendResponse);
        break;
      case "NotifyConvertProcessSuccess":
        const { data } = message as RequestMessage<number[]>;

        if (
          data.length === prevUsedReferenceIds.length &&
          data.every((id) => prevUsedReferenceIds.includes(id))
        ) {
          sendResponse({ status: "ok" });
          break;
        }

        prevUsedReferenceIds = data;

        chrome.storage.sync.get<ChromeStorage>("reference", (storage) => {
          const { reference } = storage;
          const updatedReference = reference.map((referenceData) =>
            referenceData.isWritten
              ? {
                  ...referenceData,
                  isUsed: data.includes(referenceData.id),
                }
              : referenceData
          );

          chrome.storage.sync.set({ reference: updatedReference }, () => {
            sendResponse({ status: "ok" });
          });
        });
        break;
      default:
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
});
