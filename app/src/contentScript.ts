let timer: ReturnType<typeof setTimeout> | null = null;

let chromeStorage: ChromeStorage | null = null;

const syncChromeStorage = (changes: chrome.storage.StorageChange) => {
  const [[key, value]] = Object.entries(changes);

  console.group("RefNote: chrome.storage.sync의 변경이 감지되었습니다.");
  console.table({ key, value });

  if (!chromeStorage) {
    chrome.storage.sync.get<ChromeStorage>(null, (data) => {
      chromeStorage = data;
      console.log("chromeStorage 동기화 완료", chromeStorage);
    });
    return;
  }

  console.log("chromeStorage 변경 전", chromeStorage);

  chromeStorage = {
    ...chromeStorage,
    [key]: value.newValue,
  };

  console.log("chromeStorage 변경 후", chromeStorage);
  console.groupEnd();
};

chrome.storage.sync.get<ChromeStorage>(null, (data) => {
  chrome.storage.sync.onChanged.addListener(syncChromeStorage);
  chrome.storage.sync.set({
    ...data,
    isContentScriptEnabled: true,
  });
});

window.addEventListener("unload", () => {
  chrome.storage.sync.onChanged.removeListener(syncChromeStorage);

  if (chromeStorage) {
    chrome.storage.sync.set({
      ...chromeStorage,
      isContentScriptEnabled: false,
    });
  }
});

// function sendConvertReferenceMessage(event: KeyboardEvent) {
//   // 눌린키가 유효한 키인지 확인 , 방향키나 meta 키 등 포함하지 아니함
//   if (
//     (event.key !== "Backspace" && event.key.length !== 1) ||
//     event.key === " " ||
//     event.key === "Meta" ||
//     event.key === "Alt" ||
//     event.key === "Control" ||
//     event.key === "Shift" ||
//     event.key === "ArrowUp" ||
//     event.key === "ArrowDown" ||
//     event.key === "ArrowLeft" ||
//     event.key === "ArrowRight"
//   ) {
//     return;
//   }
//   if (timer) {
//     clearTimeout(timer);
//   }
//   timer = setTimeout(async () => {
//     const [tab] = await chrome.tabs.query({
//       active: true,
//       currentWindow: true,
//     });

//     if (!tab.id) {
//       return;
//     }

//     const { status, data } = await chrome.runtime.sendMessage({
//       message: "ConvertToReference",
//       tab,
//     });
//     chrome.runtime.sendMessage({
//       message: status === "ok" ? "NotifyConvertProcessSuccess" : "NotifyError",
//       data,
//     });
//   }, 500);
// }
