export const sendMessage = <R extends unknown>(
  requestMessage: RequestMessage
) => {
  return chrome.runtime.sendMessage<unknown, ResponseMessage<R>>(
    requestMessage
  );
};
