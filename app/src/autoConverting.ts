// 중복적으로 스크립트가 주입되는 것을 방지하기 위해 window 객체에 플래그를 추가합니다.

if (!window.autoConvertingInjected) {
  window.autoConvertingInjected = true;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const sendConvertReferenceMessage = (event: KeyboardEvent) => {
    // 눌린키가 유효한 키인지 확인 , 방향키나 meta 키 등 포함하지 아니함
    if (
      event.key.length !== 1 ||
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
    timer = setTimeout(() => {
      chrome.runtime.sendMessage({ message: "CovertToReference" });
    }, 500);
  };

  chrome.runtime.onMessage.addListener((message) => {
    if (message.message === "SetAutoConverting") {
      if (message.data === "on") {
        window.addEventListener("keyup", sendConvertReferenceMessage);
      } else {
        window.removeEventListener("keyup", sendConvertReferenceMessage);
      }
      return { status: "ok" };
    }
  });

  chrome.runtime.connect().onDisconnect.addListener(() => {
    window.removeEventListener("keyup", sendConvertReferenceMessage);
  });
}
