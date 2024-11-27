import { useState, useEffect, createContext, useContext } from "react";

/**
 * Chrome Storage의 데이터들에 대한 타입입니다.
 * - UnPickedReferenceData: 사용자가 선택하지 않은 ReferenceData
 * - PickedReferenceDate: 사용자가 선택한 ReferenceData , id 값이 존재 한다.
 */
interface UnPickedReferenceData extends ReferenceData {
  isPicked: false;
}

interface PickedReferenceDate extends ReferenceData {
  isPicked: true;
  id: number;
}

type ReferenceDataInStorage = UnPickedReferenceData | PickedReferenceDate;

interface ChromeStorage extends Record<string, ReferenceDataInStorage> {}
type ChangeChromeStorage = (
  changeCallback: (chromeStorage: ChromeStorage) => ChromeStorage
) => void;

const ChromeStorageContext = createContext<{
  chromeStorage: ChromeStorage | null;
  changeChromeStorage: ChangeChromeStorage;
} | null>(null);

export const ChromeStorageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chromeStorage, setChromeStorage] = useState<ChromeStorage | null>({});

  const changeChromeStorage: ChangeChromeStorage = async (changeCallback) => {
    if (!chromeStorage) {
      return;
    }
    const changedChromeStorage = changeCallback(chromeStorage);

    try {
      setChromeStorage(changedChromeStorage);
      await chrome.storage.sync.set(changedChromeStorage);
    } catch (error) {
      // TODO : notification api 이용하여 변경하기
      console.error("chrome.storage.sync.set error", error);
      setChromeStorage(chromeStorage);
    }
  };

  useEffect(() => {
    // chrome.storage.sync 에서 데이터를 가져와 chromeStorage에 저장합니다.
    chrome.storage.sync.get(null, (data) => {
      setChromeStorage(data);
    });
  }, []);

  return (
    <ChromeStorageContext.Provider
      value={{ chromeStorage, changeChromeStorage }}
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
