import { createStore } from "../lib";

export const chromeSyncStorageInitialValue: ChromeSyncStorage = {
  reference: [],
  autoConverting: false,
  isDarkMode: false,
  isContentScriptEnabled: false,
  isUnAttachedReferenceVisible: true,
};

export const useChromeSyncStorage = createStore(
  chromeSyncStorageInitialValue,
  "sync"
);
