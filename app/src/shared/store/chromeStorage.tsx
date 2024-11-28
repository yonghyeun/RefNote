import { useState, useEffect, createContext, useContext } from "react";

const chromeStorageInitialValue: ChromeStorage = {
  reference: [],
};

const ChromeStorageContext = createContext<{
  chromeStorage: ChromeStorage;
  setChromeStorage: (
    updater: (prevStorage: ChromeStorage) => ChromeStorage
  ) => void;
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

  const setChromeStorage = (
    updater: (prevStorage: ChromeStorage) => ChromeStorage
  ) => {
    const updatedChromeStorage = updater(chromeStorage);
    chrome.storage.sync.set(updatedChromeStorage);
  };

  useEffect(() => {
    // chrome.storage.sync.get 을 통해 chrome.storage.sync 의 데이터를 가져옵니다.
    chrome.storage.sync.get(null, (chromeStorage) => {
      _syncChromeStorage(chromeStorage as ChromeStorage);
    });

    // chrome.storage.onChanged.addListener 를 통해 chrome.storage.sync 의 데이터를 실시간으로 감지합니다.
    const synchronizeChromeStorage = (change: ChromeStorageChangeEvent) => {
      // 구글 크롬 스토리지의 onChange 이벤트의 changeEvent 는 다음과 같이 생겼습니다.
      // {[key in string] : {oldValue: any, newValue: any}}
      // newValue 만을 이용해 해당 스토리지의 데이터를 변경합니다.
      const updatedChromeStorage = Object.entries(change).reduce(
        (chromeStorage, [key, value]) => {
          return {
            ...chromeStorage,
            [key]: value.newValue,
          };
        },
        {} as ChromeStorage
      );

      _syncChromeStorage(updatedChromeStorage);

      if (process.env.NODE_ENV === "development") {
        console.group("chrome.storage.onChange");
        console.dir(updatedChromeStorage);
        console.groupEnd();
      }
    };

    chrome.storage.onChanged.addListener(synchronizeChromeStorage);
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
  const context = useContext(ChromeStorageContext);
  if (!context) {
    throw new Error(
      "useChromeStorage는 항상 ChromeStorageProvider 내에서 사용되어야 합니다."
    );
  }
  return context;
};
