import { useEffect, useState } from "react";

type ChromeLocalStorageAction<T, K extends keyof T = keyof T> =
  | {
      type: "clear";
    }
  | {
      type: "set";
      key: K;
      value: T[K];
    }
  | {
      type: "remove";
      key: K;
    };

export const createLocalStore = <Store extends object>(
  initialState: Store | (() => Store)
) => {
  let store =
    typeof initialState === "function" ? initialState() : initialState;

  // 초기 호출 시 store 는 chrome.storage.local 의 값으로 초기화 됨

  chrome.storage.local.get(null, (localStorage) => {
    Object.assign(store, localStorage);
    callbacks.forEach((callback) => callback());
  });

  const callbacks = new Set<() => void>();

  const subscribe = (callback: () => void): (() => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  const getState = () => ({ ...store });

  const dispatchAction = (action: ChromeLocalStorageAction<Store>) => {
    if (import.meta.env.DEV) {
      console.group("ChromeLocalStorage Action Dispatched");
      console.log(action);
      console.groupEnd();
    }

    switch (action.type) {
      case "clear":
        chrome.storage.local.clear();
        break;
      case "set":
        chrome.storage.local.set({ [action.key]: action.value });
        break;
      case "remove":
        chrome.storage.local.remove(action.key);
        break;
    }
  };

  // chrome.storage.local 의 값에 따라 store 가 변경 되도록 함

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== "local") {
      return;
    }

    const changeEntries = Object.entries(changes).map(
      ([key, { newValue }]) => ({
        key,
        newValue,
      })
    );

    changeEntries.forEach(({ key, newValue }) => {
      store[key as keyof Store] = newValue;
    });

    if (import.meta.env.DEV) {
      console.group("변경 이후 chromeLocalStorage");
      console.table(store);
      console.groupEnd();
    }

    callbacks.forEach((callback) => callback());
  });

  const useStore = <R>(selector: (state: Store) => R) => {
    const [state, _setState] = useState(() => selector(store));

    useEffect(() => {
      const unsubscribe = subscribe(() => {
        _setState(selector(store));
      });

      return unsubscribe;
    }, []);

    return state;
  };

  useStore.dispatchAction = dispatchAction;
  useStore.getState = getState;

  return useStore;
};
