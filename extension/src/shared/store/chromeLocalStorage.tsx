import { createStore } from "../lib";

export const useChromeLocalStorage = createStore<ChromeLocalStorage>(
  {},
  "local"
);
