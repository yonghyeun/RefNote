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
    isMarkdown: boolean;
  }
}
