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

export const createStore = <Store extends object>(
  initialState: Store | (() => Store),
  namespace: chrome.storage.AreaName
) => {
  let store =
    typeof initialState === "function" ? initialState() : initialState;

  const synchronizeStore = async () => {
    const storage = await chrome.storage[namespace].get(null);

    Object.assign(store, storage);
    callbacks.forEach((callback) => callback());

    return storage;
  };

  const callbacks = new Set<() => void>();

  const subscribe = (callback: () => void): (() => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  const getState = () => ({ ...store });

  const dispatchAction = (action: ChromeLocalStorageAction<Store>) => {
    switch (action.type) {
      case "clear":
        chrome.storage[namespace].set(initialState);
        break;
      case "set":
        chrome.storage[namespace].set(action.setter(store));
        break;
      case "remove":
        chrome.storage[namespace].remove(action.key);
        break;
    }
  };

  chrome.storage.onChanged.addListener((changes, changedNameSpace) => {
    if (changedNameSpace !== namespace) {
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
