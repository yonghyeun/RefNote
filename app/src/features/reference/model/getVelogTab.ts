export const getVelogTab = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab || !tab.id || !tab.url) {
    throw new Error("현재 열린 탭의 정보를 가져오는데 실패하였습니다.");
  }

  if (!tab.url.includes("https://velog.io/write")) {
    throw new Error("해당 기능은 벨로그 > 글쓰기에서만 가능 합니다.");
  }

  return tab as Tab & { id: number; url: string };
};
