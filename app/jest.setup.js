process.on("warning", (warning) => {
  if (
    warning.name === "DeprecationWarning" &&
    warning.message.includes("punycode")
  ) {
    // 경고 메시지를 무시합니다.
    return;
  }
  // 다른 경고 메시지는 콘솔에 출력합니다.
  console.warn(warning);
});
