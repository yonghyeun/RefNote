export {};

declare global {
  type ConvertToReferenceMessage = {
    message: "ConvertToReference";
    tab: Tab;
  };

  type NotifyErrorMessage = {
    message: "NotifyError";
    data: string;
  };

  type NotifyConvertProcessSuccessMessage = {
    message: "NotifyConvertProcessSuccess";
    data: number[];
    tab: Tab;
  };

  type RequestMessage =
    | ConvertToReferenceMessage
    | NotifyErrorMessage
    | NotifyConvertProcessSuccessMessage;

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

  type BackgroundMessageHandler<T extends RequestMessage> = (
    message: T,
    sendResponse: (response: any) => void
  ) => void;

  interface Window {
    autoConvertingInjected: boolean;
  }
}
