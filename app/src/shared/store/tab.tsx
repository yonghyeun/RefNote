import { createContext, useContext, useEffect, useState } from "react";

type Tab = chrome.tabs.Tab & {
  id: number;
  url: string;
};

const TabContext = createContext<Tab | null>(null);

interface TabProviderProps {
  children: React.ReactNode;
}

export const TabProvider = ({ children }: TabProviderProps) => {
  const [tab, setTab] = useState<Tab | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      try {
        if (!tab || !tab.id || !tab.url) {
          throw new Error("현재 탭의 정보를 가져올 수 없습니다.");
        }
        setTab(tab as Tab);
      } catch (error) {
        chrome.runtime.sendMessage({
          message: "NotifyError",
          data: (error as Error).message,
        });
        setTab(null);
      }
    });

    const handleHistoryUpdate = (_tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete") {
        try {
          if (!tab || !tab.id || !tab.url) {
            throw new Error("현재 탭의 정보를 가져올 수 없습니다.");
          }
          setTab(tab as Tab);
        } catch (error) {
          chrome.runtime.sendMessage({
            message: "NotifyError",
            data: (error as Error).message,
          });
          setTab(null);
        }
      }
    };

    const handleWindowUpdate = async ({ tabId }: chrome.tabs.TabActiveInfo) => {
      const tab = await chrome.tabs.get(tabId);
      if (tab.status === "complete") {
        try {
          if (!tab || !tab.id || !tab.url) {
            throw new Error("현재 탭의 정보를 가져올 수 없습니다.");
          }
          setTab(tab as Tab);
        } catch (error) {
          chrome.runtime.sendMessage({
            message: "NotifyError",
            data: (error as Error).message,
          });
          setTab(null);
        }
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
