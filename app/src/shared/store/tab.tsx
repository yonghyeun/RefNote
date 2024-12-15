import { createContext, useContext, useEffect, useState } from "react";

const TabContext = createContext<chrome.tabs.Tab | null>(null);

interface TabProviderProps {
  children: React.ReactNode;
}

export const TabProvider = ({ children }: TabProviderProps) => {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setTab(tab);
    });

    const handleHistoryUpdate = (_tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete") {
        setTab(tab);
      }
    };

    const handleWindowUpdate = async ({ tabId }: chrome.tabs.TabActiveInfo) => {
      const tab = await chrome.tabs.get(tabId);
      if (tab.status === "complete") {
        setTab(tab);
      }
    };

    chrome.tabs.onUpdated.addListener(handleHistoryUpdate);
    chrome.tabs.onActivated.addListener(handleWindowUpdate);
    return () => {
      chrome.tabs.onUpdated.removeListener(handleHistoryUpdate);
      chrome.tabs.onActivated.removeListener(handleWindowUpdate);
    };
  }, []);

  return <TabContext.Provider value={tab}>{children}</TabContext.Provider>;
};

export const useTab = () => {
  return useContext(TabContext);
};
