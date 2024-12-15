import { useState, useEffect, createContext, useContext } from "react";

export const chromeStorageInitialValue: ChromeStorage = {
  reference: [],
  autoConverting: false,
  isDarkMode: false,
};

const ChromeStorageContext = createContext<{
  chromeStorage: ChromeStorage;
  setChromeStorage: (
    updater: (prevStorage: ChromeStorage) => ChromeStorage
  ) => Promise<void>;
} | null>(null);

// ChromeStorageProvider 는 오로지 readonly 형태인 chrome.storage.sync 데이터를 메모리에 저장한 chromeStorage 객체만을 반환합니다.
// 상태 변경 흐름의 통일성을 위해 모든 상태 변경은 chromeStorage 객체를 통해 이루어집니다.
export const ChromeStorageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chromeStorage, _syncChromeStorage] = useState<ChromeStorage>(
    chromeStorageInitialValue
  );

  const setChromeStorage = async (
    updater: (prevStorage: ChromeStorage) => ChromeStorage
  ) => {
    const prevChromeStorage = (await chrome.storage.sync.get(
      null
    )) as ChromeStorage;

    const updatedChromeStorage = updater(prevChromeStorage);
    chrome.storage.sync.set(updatedChromeStorage);
  };

  useEffect(() => {
    // chrome.storage.onChanged.addListener 를 통해 chrome.storage.sync 의 데이터를 실시간으로 감지합니다.
    const synchronizeChromeStorage = async () => {
      const updatedChromeStorage = await chrome.storage.sync.get(null);
      _syncChromeStorage(updatedChromeStorage as ChromeStorage);
    };
    chrome.storage.onChanged.addListener(synchronizeChromeStorage);

    // chrome.storage.sync.get 을 통해 chrome.storage.sync 의 데이터를 가져옵니다.
    chrome.storage.sync.get(chromeStorageInitialValue, (data) => {
      if (Object.keys(data).length > 0) {
        _syncChromeStorage(data as ChromeStorage);
      } else {
        chrome.storage.sync.set(chromeStorageInitialValue);
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(synchronizeChromeStorage);
    };
  }, []);

  return (
    <ChromeStorageContext.Provider
      value={{
        chromeStorage,
        setChromeStorage,
      }}
    >
      {children}
    </ChromeStorageContext.Provider>
  );
};

export const useChromeStorage = () => {
  const context = useContext(ChromeStorageContext)!;
  return context;
};
