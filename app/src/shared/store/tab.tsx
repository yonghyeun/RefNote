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

    const handleTabUpdate = (_tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete") {
        setTab(tab);
      }
    };
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, []);

  return <TabContext.Provider value={tab}>{children}</TabContext.Provider>;
};

export const useTab = () => {
  return useContext(TabContext);
};
