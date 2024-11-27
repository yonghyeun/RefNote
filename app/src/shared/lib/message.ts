export const sendMessage = async <T extends unknown>({
  message,
  tabId,
}: RequestMessage) => {
  const responseMessage = await chrome.runtime.sendMessage<RequestMessage>({
    message,
    tabId,
  });
  return responseMessage.message as T;
};
