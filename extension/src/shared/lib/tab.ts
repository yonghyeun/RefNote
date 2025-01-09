export const isTab = (tab: chrome.tabs.Tab | undefined): tab is Tab =>
  !!tab && !!tab.id && !!tab.url && !!tab.title;

export const isVelogWritePage = (tab: Tab | null) => {
  if (!tab) {
    return false;
  }
  return tab.url.includes("https://velog.io/write");
};
