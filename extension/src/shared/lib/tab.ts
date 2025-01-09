export const isTab = (tab: chrome.tabs.Tab | undefined): tab is Tab =>
  !!tab && !!tab.id && !!tab.url && !!tab.title;
