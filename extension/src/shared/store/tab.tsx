import { createContext, useContext, useEffect, useState } from "react";
import { isTab } from "../lib";

type Tab = chrome.tabs.Tab & {
  id: number;
  url: string;
  title: string;
};

const TabContext = createContext<Tab | null>(null);

interface TabProviderProps {
  children: React.ReactNode;
}

export const TabProvider = ({ children }: TabProviderProps) => {
  const [tab, setTab] = useState<Tab | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setTab(isTab(tab) ? tab : null);
    });

    const handleHistoryUpdate = (_tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete") {
        setTab(isTab(tab) ? tab : null);
      }
    };

    const handleWindowUpdate = async ({ tabId }: chrome.tabs.TabActiveInfo) => {
      const tab = await chrome.tabs.get(tabId);
      if (tab.status === "complete") {
        setTab(isTab(tab) ? tab : null);
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
