import { useEffect, useState } from "react";

type ChromeLocalStorageAction<T> =
  | {
      type: "clear";
    }
  | {
      type: "set";
      setter: (storage: T) => Partial<T>;
    }
  | {
      type: "remove";
      key: keyof T;
    };

export const createLocalStore = <Store extends object>(
  initialState: Store | (() => Store)
) => {
  let store =
    typeof initialState === "function" ? initialState() : initialState;

  const synchronizeStore = () => {
    chrome.storage.local.get(null, (storage) => {
      if (import.meta.env.DEV) {
        console.group("동기화를 시행 할 chromeLocalStorage 값");
        console.table(store);
        console.groupEnd();
      }

      Object.assign(store, storage);
      callbacks.forEach((callback) => callback());
    });
  };

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
        chrome.storage.local.set(initialState);
        break;
      case "set":
        chrome.storage.local.set(action.setter(store));
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
  useStore.synchronizeStore = synchronizeStore;

  synchronizeStore();

  return useStore;
};
