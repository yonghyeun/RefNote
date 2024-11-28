export {};

declare global {
  interface RequestMessage {
    message: string;
    tabId: number;
  }

  interface ResponseMessage {
    status: "ok" | Error;
    tabId: number;
  }

  interface ReferenceData {
    title: string;
    url: string;
    faviconUrl: string;
    isWritten: boolean;
  }

  interface ChromeStorage {
    reference: ReferenceData[];
  }

  interface ChromeStorageChangeEvent {
    [key in typeof ChromeStorage]: {
      oldValue: ChromeStorage[key] | undefined;
      newValue: ChromeStorage[key];
    };
  }
}
