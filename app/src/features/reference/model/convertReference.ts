type BracketOnly = `[${number}]` | `[[${number}]]`;
type BracketWithUrl = `[[${number}]](${string})`;

/**
 * convertNumberToReference 은 도메인마다 서로 다른 로직을 가지고 있습니다.
 * 이에 적용 가능한 도메인 별로 로직을 따로 만들어야 합니다.
 * 적용 가능한 도메인에서만 해당 버튼을 이용 할 수 있도록 합니다.
 */
export const convertNumberToReference = async (tab: Tab) => {
  const { reference } =
    await chrome.storage.sync.get<ChromeStorage>("reference");

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: async (attachedReferenceArray) => {
      const codeMirror = (
        document.querySelector(".CodeMirror") as CodeMirrorElement
      ).CodeMirror;

      if (!codeMirror) {
        await chrome.notifications.create(
          "codeMirror",
          {
            type: "basic",
            iconUrl: "/icon/96.png",
            title: "오류 발생",
            message:
              "codeMirror 인스턴스를 찾을 수 없습니다. 벨로그가 업데이트 되었는데 게으른 개발자가 업데이트를 하지 않은 거 같습니다 미안합니다..",
          },
          () => {
            setTimeout(() => {
              chrome.notifications.clear("codeMirror");
            }, 3000);
          }
        );
        return;
      }

      const getRegExp = (key: "combinedBracketRegExp" | "bracketWithUrl") => {
        const regExpMap = {
          combinedBracketRegExp: /(?<!\[)\[\d+\](?!\]|\()|\[\[\d+\]\](?!\()/g,
          bracketWithUrl: /\[\[\d+\]\]\(http[s]?:\/\/[^\s]+\)/g,
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

      const excludeId = (bracket: BracketOnly) => {
        return Number(bracket.replace(/\[|\]/g, ""));
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
      );

      // 변환 할 문구가 없다면 early return 합니다.

      if (
        bracketOnlyMatchArray.length +
          bracketWithUrlMatchArray.filter((bracketWithUrlMatch) => {
            const referenceId = excludeId(
              bracketWithUrlMatch.split("(")[0] as BracketOnly
            );
            const url = bracketWithUrlMatch.split("(")[1].slice(0, -1);

            return (
              isReferenceIdValid(referenceId, attachedReferenceArray) &&
              !isReferenceUrlValid({ referenceId, url }, attachedReferenceArray)
            );
          }).length <
        1
      ) {
        return;
      }

      let convertedText: string = codeMirror.getValue();

      // url이 변경 될 필요가 있는 bracketWithUrlMatchArray 를 랜덤한 key로 변경해줍니다.
      // bracketOnlyMatchUrlArray 변환 과정에서 동일한 referenceId 를 가진 bracket이 있어 충돌 할 수 있기 때문입니다.
      // bracketOnlyMatchUrlArray 변환 이후 변경되었던 key를 다시 올바른 bracketWithUrl로 변경해줄 것입니다.

      const bracketWithUrlMatchMap = new Map<string, string>();

      bracketWithUrlMatchArray.forEach((bracketWithUrl) => {
        const referenceId = excludeId(
          bracketWithUrl.split("(")[0] as BracketOnly
        );
        const url = bracketWithUrl.split("(")[1].slice(0, -1);
        const bracketWithUrlMatchKey = Math.random().toString();

        const bracketWithUrlMatchValue =
          isReferenceIdValid(referenceId, attachedReferenceArray) &&
          !isReferenceUrlValid({ referenceId, url }, attachedReferenceArray)
            ? `[[${referenceId}]](${attachedReferenceArray[referenceId - 1].url})`
            : bracketWithUrl;

        bracketWithUrlMatchMap.set(
          bracketWithUrlMatchKey,
          bracketWithUrlMatchValue
        );

        const globalBracketWithUrl = new RegExp(
          bracketWithUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "g"
        );

        convertedText = convertedText.replace(
          globalBracketWithUrl,
          bracketWithUrlMatchKey
        );
      });

      bracketOnlyMatchArray.forEach((bracket) => {
        const referenceId = excludeId(bracket);
        const url = attachedReferenceArray[referenceId - 1].url;
        const globalBracket = new RegExp(
          bracket.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "g"
        );

        convertedText = convertedText.replace(
          globalBracket,
          `[[${referenceId}]](${url})`
        );
      });

      // 변경 되었던 bracketWithUrlMatchKey를 다시 올바른 bracketWithUrl로 변경해줍니다.

      [...bracketWithUrlMatchMap.entries()].forEach(([key, value]) => {
        convertedText = convertedText.replace(new RegExp(key, "g"), value);
      });

      codeMirror.setValue(convertedText);

      // setValue로 변경 이후 비동기적으로 커서를 마지막 줄로 이동시킵니다.

      setTimeout(() => {
        codeMirror.setCursor({ line: codeMirror.lineCount(), ch: 0 });
        codeMirror.focus();
      }, 0);
    },

    args: [
      reference.filter((data): data is AttachedReferenceData => data.isWritten),
    ],
  });
};
