interface CodeMirrorMockInterface {
  getValue: () => string;
  setValue: (value: string) => void;
}

interface CodeMirrorElement extends HTMLElement {
  CodeMirror: CodeMirrorMockInterface;
}

type BracketOnly = `[${number}]` | `[[${number}]]`;
type BracketWithUrl = `[[${number}]]${string}`;

/**
 * convertNumberToReference 은 도메인마다 서로 다른 로직을 가지고 있습니다.
 * 이에 적용 가능한 도메인 별로 로직을 따로 만들어야 합니다.
 * 적용 가능한 도메인에서만 해당 버튼을 이용 할 수 있도록 합니다.
 */
export const convertNumberToReference = async ({
  tab,
  data,
}: {
  tab: Tab;
  data: ReferenceData[];
}) => {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: async (attachedReferenceArray) => {
      const codeMirror = (
        document.querySelector(".CodeMirror") as CodeMirrorElement
      ).CodeMirror;

      const getRegExp = (
        key: "combinedBracketRegExp" | "url" | "bracketWithUrl"
      ) => {
        const regExpMap = {
          combinedBracketRegExp: /(?<!\[)\[\d+\](?!\]|\()|\[\[\d+\]\](?!\()/g,
          bracketWithUrl: /\[\[\d+\]\]\(http[s]?:\/\/[^\s]+\)/g,
          url: /http[s]?:\/\/[^\s]+/g,
        };
        return regExpMap[key];
      };

      const getBracketOnlyMatch = (text: string) => {
        const bracketRegExp = getRegExp("combinedBracketRegExp");
        return Array.from(
          new Set((text.match(bracketRegExp) as BracketOnly[]) || [])
        );
      };

      const getBracketWithUrlMatch = (text: string) => {
        const bracketWithUrl = getRegExp("bracketWithUrl");
        return Array.from(
          new Set((text.match(bracketWithUrl) as BracketWithUrl[]) || [])
        );
      };

      const excludeId = (str: string) => {
        const [bracket] = str.match(getRegExp("combinedBracketRegExp")) || [];
        return bracket ? Number(bracket.replace(/\[|\]/g, "")) : 999999;
      };

      const excludeUrl = (str: string) => {
        const [url] = str.match(getRegExp("url")) || [];
        return url || "wrongUrlMatch";
      };

      const isReferenceIdValid = (
        referenceId: number,
        attachedReferenceArray: AttachedReferenceData[]
      ) => {
        return attachedReferenceArray.some(
          (reference) => reference.id === referenceId
        );
      };

      const isReferenceUrlValid = (
        { referenceId, url }: { referenceId: number; url: string },
        attachedReferenceArray: AttachedReferenceData[]
      ) => {
        return attachedReferenceArray[referenceId - 1].url === url;
      };

      const bracketOnlyMatchArray = getBracketOnlyMatch(
        codeMirror.getValue()
      ).filter((match) => {
        return isReferenceIdValid(excludeId(match), attachedReferenceArray);
      });

      const bracketWithUrlMatchArray = getBracketWithUrlMatch(
        codeMirror.getValue()
      ).filter((match) => {
        const referenceId = excludeId(match);
        const url = excludeUrl(match);

        return (
          isReferenceIdValid(referenceId, attachedReferenceArray) &&
          !isReferenceUrlValid({ referenceId, url }, attachedReferenceArray)
        );
      });

      const convertedText = [
        ...bracketOnlyMatchArray,
        ...bracketWithUrlMatchArray,
      ].reduce((text, match) => {
        const referenceId = excludeId(match);
        const attachedReference = attachedReferenceArray[referenceId - 1];
        return text.replace(
          match,
          `[[${referenceId}]](${attachedReference.url})`
        );
      }, codeMirror.getValue());

      codeMirror.setValue(convertedText);
    },

    args: [
      data.filter((data): data is AttachedReferenceData => data.isWritten),
    ],
  });

  return result.result;
};
