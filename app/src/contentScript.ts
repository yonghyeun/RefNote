let timer: ReturnType<typeof setTimeout> | null = null;
let isAbleToSendMessage: boolean = true;

const sendConvertReferenceMessage = (event: KeyboardEvent) => {
  // 눌린키가 유효한 키인지 확인 , 방향키나 meta 키 등 포함하지 아니함
  if (
    (event.key !== "Backspace" && event.key.length !== 1) ||
    event.key === " " ||
    event.key === "Meta" ||
    event.key === "Alt" ||
    event.key === "Control" ||
    event.key === "Shift" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    return;
  }
  if (!chromeStorage || !chromeStorage.autoConverting || !isAbleToSendMessage) {
    return;
  }

  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(async () => {
    isAbleToSendMessage = false;
    const { status, data } = await chrome.runtime.sendMessage({
      message: "ConvertToReference",
    });
    chrome.runtime.sendMessage({
      message: status === "ok" ? "NotifyConvertProcessSuccess" : "NotifyError",
      data,
    });
    isAbleToSendMessage = true;
  }, 500);
};

const handleAutoConverting = (changes: chrome.storage.StorageChange) => {
  const [[key, { newValue }]] = Object.entries(changes);

  if (key !== "autoConverting") {
    return;
  }

  if (newValue) {
    window.addEventListener("keydown", sendConvertReferenceMessage);
  } else {
    window.removeEventListener("keydown", sendConvertReferenceMessage);
  }
};

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
  chrome.storage.sync.onChanged.addListener(handleAutoConverting);

  chrome.storage.sync.set({
    ...data,
    isContentScriptEnabled: true,
  });
});

window.addEventListener("unload", () => {
  chrome.storage.sync.onChanged.removeListener(syncChromeStorage);
  chrome.storage.sync.onChanged.removeListener(handleAutoConverting);

  if (chromeStorage) {
    chrome.storage.sync.set({
      ...chromeStorage,
      isContentScriptEnabled: false,
    });
  }
});

// document 에 이미 작성 된 출처 리스트를 가져와 chromeStorage를 업데이트 합니다.

(async () => {
  const usedAttachedReferenceDataArray = (
    Array.from(document.querySelectorAll("li > a")) as HTMLAnchorElement[]
  ).map(({ href, textContent }, idx) => ({
    id: idx + 1,
    url: href,
    title: textContent,
    isWritten: true,
    isUsed: true,
    faviconUrl: undefined,
  }));

  const { reference } =
    await chrome.storage.sync.get<ChromeStorage>("reference");

  // 만약 사용 된 데이터가 없고 attachedReferenceData 모두 isUsed가 false 라면
  // 상태를 변경하지 않고 early return 합니다.

  if (usedAttachedReferenceDataArray.length === 0) {
    if (
      reference.filter((data) => data.isWritten).every(({ isUsed }) => !isUsed)
    ) {
      return;
    }

    chrome.storage.sync.set({
      reference: reference.map((referenceData) =>
        referenceData.isWritten
          ? { ...referenceData, isUsed: false }
          : referenceData
      ),
    });
    return;
  }
  // 만약 usedAttachedReferenceData가 존재 한다면
  // usedAttachedReferenceData를 모두 attachedReferenceData로 이동 시키고
  // 기존 attachedReferenceData는 unAttachedReferenceData로 변경합니다.

  const updatedReferenceDataArray: UnAttachedReferenceData[] = reference
    .filter((prevReference) =>
      usedAttachedReferenceDataArray.every(
        ({ url }) => url !== prevReference.url
      )
    )
    .map(({ title, faviconUrl, url }) => ({
      title,
      faviconUrl,
      url,
      isWritten: false,
    }));

  chrome.storage.sync.set({
    reference: [
      ...updatedReferenceDataArray,
      ...usedAttachedReferenceDataArray,
    ],
  });
})();
