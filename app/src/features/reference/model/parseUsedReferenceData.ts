import { getCurrentActiveTab } from "@/shared/lib";

/**
 * codeMirror 인스턴스에 적힌 글에서 [[숫자]](url) 형태의 문자열을 파싱합니다.
 * @sendResponse { id: number, url: string }[]
 */
export const parseUsedReferenceData = async (
  sendResponse: (response: ResponseMessage) => void
) => {
  try {
    const tab = await getCurrentActiveTab();
    const [result] = await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      world: "MAIN",
      func: async () => {
        const codeMirror = (
          document.querySelector(".CodeMirror") as CodeMirrorElement
        ).CodeMirror;

        if (!codeMirror) {
          throw new Error("codeMirror 인스턴스를 찾을 수 없습니다.");
        }

        const text: string = codeMirror.getValue();

        const referenceMatch = Array.from(
          new Set(text.match(/\d+\. \[([^\]]+)\]\((http[s]?:\/\/[^\s]+)\)/g)) ||
            []
        );

        return referenceMatch.map((match) => {
          const id = Number(match.match(/\d+/)![0]);
          const url = match.match(/http[s]?:\/\/[^\s]+/)![0].slice(0, -1);

          // URL을 이스케이프하여 정규 표현식에 포함
          const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const titleRegex = new RegExp(
            `\\[([^\\]]+)\\]\\(${escapedUrl}\\)`,
            "g"
          );
          const [titleMatch] = text.match(titleRegex) || [];

          const title = titleMatch
            ? titleMatch.split("]")[0].slice(1)
            : "출처에서 제목을 찾지 못했습니다.";

          return {
            id,
            url,
            title,
            isWritten: true,
            isUsed: true,
          };
        });
      },
    });

    sendResponse({
      status: "ok",
      data: result.result,
    });
  } catch (error) {
    sendResponse({
      status: "error",
      data: (error as Error).message,
    });
  }
};
