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

  interface UnWrittenReferenceData {
    title: string;
    url: string;
    faviconUrl: string;
    isWritten: false;
  }

  interface WrittenReferenceData {
    title: string;
    url: string;
    faviconUrl: string;
    isWritten: true;
    id: number;
  }

  type ReferenceData = UnWrittenReferenceData | WrittenReferenceData;

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
