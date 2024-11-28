export const getReferenceData = async (
  tabId: NonNullable<chrome.tabs.Tab["id"]>
) => {
  const [reference] = await chrome.scripting.executeScript({
    target: { tabId },
    func: (): UnPickedReferenceData => ({
      title: document.title,
      url: document.URL,
      faviconUrl: (
        document.querySelector('link[rel="icon"]') as HTMLLinkElement
      )?.href,
      date: new Date().getTime(),
      isPicked: false,
    }),
  });

  if (!reference || !reference.result) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("레퍼런스 데이터를 가져오는데 실패했습니다.");
    }
    return reference as never;
  }

  return reference.result;
};
