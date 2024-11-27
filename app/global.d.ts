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
}
