export const getCurrentActiveTab = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab || !tab.id || !tab.url) {
    throw new Error("현재 탭의 정보를 불러 올 수 없습니다.");
  }

  return tab as chrome.tabs.Tab & { id: number; url: string };
};
