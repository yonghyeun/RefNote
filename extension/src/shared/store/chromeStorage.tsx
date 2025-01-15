import { useEffect } from "react";
import { createStore } from "../lib/createStore";

export const chromeStorageInitialValue: ChromeStorage = {
  reference: [],
  autoConverting: false,
  isDarkMode: false,
  isContentScriptEnabled: false,
  isUnAttachedReferenceVisible: true,
};

export const useChromeStorage = createStore(chromeStorageInitialValue);

export const ChromeStorageUpdater = () => {
  const store = useChromeStorage((state) => state);

  useEffect(() => {
    chrome.storage.sync.get(null, (store) => {
      useChromeStorage.setState(store as ChromeStorage);
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set(store);
  }, [store]);

  return null;
};
