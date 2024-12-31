export {};

declare global {
  type RequestMessage<T = undefined> = T extends undefined
    ? { message: string; tab: Tab }
    : { message: string; tab: Tab; data: T };

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

  interface ChromeStorage {
    reference: ReferenceData[];
    autoConverting: boolean;
    isDarkMode: boolean;
    unAttachedIsVisible: boolean;
    isContentScriptEnabled: boolean;
  }

  interface Tab extends chrome.tabs.Tab {
    id: NonNullable<chrome.tabs.Tab["id"]>;
    url: NonNullable<chrome.tabs.Tab["url"]>;
  }

  interface CodeMirrorElement extends HTMLElement {
    CodeMirror: CodeMirror;
  }

  interface Window {
    autoConvertingInjected: boolean;
  }
}
