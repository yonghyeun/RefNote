type ToastMessage = (
  toastOption: {
    toastKey: string;
    message: string;
    title: string;
    type?: chrome.notifications.TemplateType;
  },
  duration: number,
  callback?: (notificationId: string) => void
) => void;

export const toastMessage: ToastMessage = (
  { toastKey, message, title, type },
  duration,
  callback
) => {
  chrome.notifications.create(
    toastKey,
    {
      type: type || "basic",
      iconUrl: "/icon/128.png",
      title,
      message,
      silent: true,
    },
    () => {
      callback?.(toastKey);
      setTimeout(() => {
        chrome.notifications.clear(toastKey);
      }, duration);
    }
  );
};
