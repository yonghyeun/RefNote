let timer: ReturnType<typeof setTimeout> | null = null;

const parseUsedReferenceData = () => {
  const references: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll("li > a")
  );
  return references.map(({ href, textContent }, idx) => ({
    id: idx + 1,
    url: href,
    title: textContent,
    isWritten: true,
    isUsed: true,
    faviconUrl: undefined,
  }));
};

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

  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    const { status, data } = await chrome.runtime.sendMessage({
      message: "ConvertToReference",
    });

    chrome.runtime.sendMessage({
      message: status === "ok" ? "NotifyConvertProcessSuccess" : "NotifyError",
      data,
    });
  }, 500);
};

chrome.runtime.onMessage.addListener(
  ({ message, data }, _sender, sendResponse) => {
    if (message === "SetAutoConverting") {
      if (data === "on") {
        window.addEventListener("keyup", sendConvertReferenceMessage);
      } else {
        window.removeEventListener("keyup", sendConvertReferenceMessage);
      }
      sendResponse({ status: "ok" });
    }

    if (message === "ParseUsedReferenceData") {
      sendResponse({
        status: "ok",
        data: parseUsedReferenceData(),
      });
    }
  }
);
