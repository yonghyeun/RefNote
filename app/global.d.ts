export {};

declare global {
  interface Message {
    message: string;
    tabId: number;
  }
}
