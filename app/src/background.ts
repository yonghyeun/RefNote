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

chrome.runtime.onMessage.addListener(
  async (message: RequestMessage, _sender, sendResponse) => {
    /**
     * 비동기 메시지 핸들러의 경우 핸들러 응답값에 따라 response 를 보내는 고차 함수 입니다.
     */
    const handleAsyncMessage = <T extends unknown>(
      handler: () => Promise<unknown>
    ) => {
      handler()
        .then((data) => {
          sendResponse({
            status: "ok",
            data: data as T,
          });
        })
        .catch((error) => {
          chrome.notifications.create(
            "alarm",
            {
              type: "basic",
              iconUrl: "/icon/128.png",
              title: "오류",
              message: error.message,
              silent: true,
            },
            () => {
              setTimeout(() => {
                chrome.notifications.clear("alarm");
              }, 3000);
            }
          );

          sendResponse({
            status: error,
          });
        });
      return true;
    };

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) {
      console.log("tab not found");
      sendResponse({
        status: "tab not found",
      });
    }
    const currentActiveTab = tab as Tab;

    switch (message.message) {
      case "ConvertToReference":
        return handleAsyncMessage(() =>
          convertNumberToReference(currentActiveTab)
        );
      case "NotifyError":
        return handleAsyncMessage(async () => {
          await chrome.notifications.create(
            "alarm",
            {
              type: "basic",
              iconUrl: "/icon/128.png",
              title: "오류",
              message: message.data as string,
              silent: true,
            },
            () => {
              setTimeout(() => {
                chrome.notifications.clear("alarm");
              }, 3000);
            }
          );
        });
      default:
        return message.message;
    }
  }
);

chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id !== undefined) {
    openSidePanel(tab as Tab);
  }
});
