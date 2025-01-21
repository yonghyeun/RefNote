export {};

declare global {
  type RequestMessage<T = undefined> = T extends undefined
    ? { message: string; tab?: Tab }
    : { message: string; tab?: Tab; data: T };

  interface ResponseMessage<R = unknown> {
    status: "ok" | "error";
    data: R;
  }

  interface UnAttachedReferenceData {
    title: string;
    url: string;
    faviconUrl?: string;
    isWritten: false;
  }

  interface AttachedReferenceData {
    title: string;
    url: string;
    faviconUrl?: string;
    isWritten: true;
    id: number;
    isUsed: boolean;
  }

  type ReferenceData = UnAttachedReferenceData | AttachedReferenceData;

  interface ChromeSyncStorage {
    reference: ReferenceData[];
    autoConverting: boolean;
    isDarkMode: boolean;
    isContentScriptEnabled: boolean;
    isUnAttachedReferenceVisible: boolean;
  }

  type ChromeLocalStorage = Record<string, string>;

  interface Tab extends chrome.tabs.Tab {
    id: NonNullable<chrome.tabs.Tab["id"]>;
    url: NonNullable<chrome.tabs.Tab["url"]>;
    title: NonNullable<chrome.tabs.Tab["title"]>;
  }

  interface CodeMirrorElement extends HTMLElement {
    CodeMirror: CodeMirror;
  }

  interface Window {
    autoConvertingInjected: boolean;
  }
}
