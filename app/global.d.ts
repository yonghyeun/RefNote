export {};

declare global {
  interface RequestMessage<T = unknown> {
    message: string;
    data?: T;
  }

  interface ResponseMessage<R = unknown> {
    status: "ok" | "error";
    data: R;
  }

  interface UnAttachedReferenceData {
    title: string;
    url: string;
    faviconUrl: string;
    isWritten: false;
  }

  interface AttachedReferenceData {
    title: string;
    url: string;
    faviconUrl: string;
    isWritten: true;
    id: number;
  }

  type ReferenceData = UnAttachedReferenceData | AttachedReferenceData;

  interface ChromeStorage {
    reference: ReferenceData[];
    autoConverting: boolean;
    isDarkMode: boolean;
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
