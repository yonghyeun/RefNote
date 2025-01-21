import { useEffect, useState } from "react";

type Selector<T, R> = (state: T) => R;

export const createSyncStore = <Store extends object>(
  initialState: Store | (() => Store)
) => {
  let store =
    typeof initialState === "function" ? initialState() : initialState;

  const callbacks = new Set<() => void>();

  const subscribe = (callback: () => void): (() => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  const getState = () => ({ ...store });

  const setState = (
    action: Partial<Store> | ((state: Store) => Partial<Store>)
  ) => {
    const newState =
      typeof action === "function" ? action({ ...store }) : action;

    store = {
      ...store,
      ...newState,
    };

    callbacks.forEach((callback) => callback());
  };

  const useStore = <R>(selector: Selector<Store, R>) => {
    const [state, _setState] = useState(() => selector(store));

    useEffect(() => {
      const unsubscribe = subscribe(() => {
        _setState(selector(store));
      });

      return unsubscribe;
    }, []);

    return state;
  };

  useStore.setState = setState;
  useStore.getState = getState;

  return useStore;
};
