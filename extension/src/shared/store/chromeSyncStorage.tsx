import { useEffect, useRef } from "react";
import { createSyncStore } from "../lib";

export const chromeSyncStorageInitialValue: ChromeSyncStorage = {
  reference: [],
  autoConverting: false,
  isDarkMode: false,
  isContentScriptEnabled: false,
  isUnAttachedReferenceVisible: true,
};

export const useChromeSyncStorage = createSyncStore(
  chromeSyncStorageInitialValue
);

export const ChromeSyncStorageUpdater = () => {
  const store = useChromeSyncStorage((state) => state);
  const initializeFlag = useRef<boolean>(false);
  const synchronizeFlag = useRef<boolean>(false);

  useEffect(() => {
    // 초기 마운트 시 chrome storage에서 값을 가져와서 store에 저장

    chrome.storage.sync.get(null, (store) => {
      useChromeSyncStorage.setState(store as ChromeSyncStorage);
    });

    // 서로 다른 컨텍스트를 가진 탭에서 chrome.storage.sync 의 변화에 맞춰
    // 리액트의 메모리도 업데이트 될 수 있도록 onChangeHandler 등록

    const onSynchronize = (
      changes: chrome.storage.StorageChange,
      namespace: chrome.storage.AreaName
    ) => {
      if (namespace !== "sync") {
        return;
      }

      const newState = Object.entries(changes).reduce(
        (newState, [key, { newValue }]) => {
          newState[key as keyof ChromeSyncStorage] = newValue;
          return newState;
        },
        {} as Partial<ChromeSyncStorage>
      );

      useChromeSyncStorage.setState(newState);
      synchronizeFlag.current = true;
    };

    chrome.storage.onChanged.addListener(onSynchronize);

    return () => chrome.storage.onChanged.removeListener(onSynchronize);
  }, []);

  useEffect(() => {
    // 초기 마운트 시에는 chrome.storage.sync에 저장하지 않음
    if (!initializeFlag.current) {
      initializeFlag.current = true;
      return;
    }

    // synchronizeFlag가 true일 경우에는 chrome.storage.sync에 저장하지 않음

    if (synchronizeFlag.current) {
      synchronizeFlag.current = false;
      return;
    }

    chrome.storage.sync.set(store);
  }, [store]);

  return null;
};
