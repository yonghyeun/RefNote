export const parseUsedReferenceArray = async (
  { id: tabId }: Tab,
  sendResponse: (response: unknown) => void
) => {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: () =>
      new Promise((res) => {
        // TODO : SPA 에서 데이터가 hydration 된 후에 실행되도록 하는 방법 연구 하기
        // 스케쥴 api를 이용 할 수 있을까 ?
        setTimeout(() => {
          const references: HTMLAnchorElement[] = Array.from(
            document.querySelectorAll("li > a")
          );
          res(
            references.map(({ href, textContent }, idx) => ({
              id: idx + 1,
              url: href,
              title: textContent,
              isWritten: true,
              isUsed: true,
              faviconUrl: undefined,
            }))
          );
        }, 500);
      }),
  });

  sendResponse({
    status: "ok",
    data: result.result,
  });
};
