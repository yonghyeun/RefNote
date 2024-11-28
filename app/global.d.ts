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
    date: number;
    isPicked: boolean;
  }

  interface UnPickedReferenceData extends ReferenceData {
    isPicked: false;
  }

  interface PickedReferenceDate extends ReferenceData {
    isPicked: true;
    id: number;
  }

  interface ChromeStorage {
    reference: (UnPickedReferenceData | PickedReferenceDate)[];
  }

  interface ChromeStorageChangeEvent {
    [key in typeof ChromeStorage]: {
      oldValue: ChromeStorage[key] | undefined;
      newValue: ChromeStorage[key];
    };
  }
}
