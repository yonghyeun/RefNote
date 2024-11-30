export {};

declare global {
  interface RequestMessage<T = unknown> {
    message: string;
    tabId: number;
    data?: T;
  }

  interface ResponseMessage<R = unknown> {
    status: "ok" | Error;
    tabId: number;
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
    isMarkdown: boolean;
  }
}
