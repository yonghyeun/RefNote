type BracketOnly = `[${number}]` | `[[${number}]]`;
type BracketWithUrl = `[[${number}]](${string})`;

export const convertNumberToReference = async (
  { id: tabId }: Tab,
  sendResponse: (response: ResponseMessage) => void
) => {
  const { reference } =
    await chrome.storage.sync.get<ChromeSyncStorage>("reference");

  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: async (attachedReferenceArray) => {
      const codeMirror = (
        document.querySelector(".CodeMirror") as CodeMirrorElement
      ).CodeMirror;

      if (!codeMirror) {
        return {
          status: "error",
          data: "codeMirror 인스턴스를 찾을 수 없습니다. 벨로그가 업데이트 되었는데 게으른 개발자가 업데이트를 하지 않은 거 같습니다 미안합니다..",
        };
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

      const bracketOnlyMatchArray = getBracketOnlyMatch(
        codeMirror.getValue()
      ).filter((match) => {
        return excludeId(match) <= attachedReferenceArray.length;
      });

      const getUsedReferenceIds = (text: string) => {
        const usedIds =
          text
            .match(getRegExp("bracketWithUrl"))
            ?.map((bracket) =>
              excludeId(bracket.split("(")[0] as BracketOnly)
            ) || [];

        usedIds.sort((a, b) => a - b);

        return Array.from(new Set(usedIds));
      };

      const bracketWithUrlMatchArray = getBracketWithUrlMatch(
        codeMirror.getValue()
      );

      // 변환 할 bracket이 없는 경우엔 사용 된 id들을 반환 합니다.

      if (
        bracketOnlyMatchArray.length === 0 &&
        bracketWithUrlMatchArray.every((bracket) => {
          const referenceId = excludeId(bracket.split("(")[0] as BracketOnly);
          const url = bracket.split("(")[1].slice(0, -1);
          return (
            attachedReferenceArray.find(({ id }) => id === referenceId)?.url ===
            url
          );
        })
      ) {
        return getUsedReferenceIds(codeMirror.getValue());
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

        // url이 올바르지만 변호가 잘못된 경우엔 url을 기준으로 번호를 수정 합니다.
        // 번호가 올바르지만 url이 잘못된 경우엔 번호를 기준으로 url을 수정 합니다.

        const correctReference =
          attachedReferenceArray.find((reference) => reference.url === url) ||
          attachedReferenceArray.find(
            (reference) => reference.id === referenceId
          )!;

        bracketWithUrlMatchMap.set(
          bracketWithUrlMatchKey,
          `[[${correctReference.id}]](${correctReference.url})`
        );

        convertedText = convertedText.replace(
          new RegExp(
            bracketWithUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "g"
          ),
          bracketWithUrlMatchKey
        );
      });

      bracketOnlyMatchArray.forEach((bracket) => {
        const referenceId = excludeId(bracket);
        const url = attachedReferenceArray.find(
          ({ id }) => id === referenceId
        )!.url;
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

      // 변경된 부분을 찾기 위해 이전의 값을 캐싱 후 setValue로 변경합니다.
      const prevText = codeMirror.getValue();
      codeMirror.setValue(convertedText);

      setTimeout(() => {
        const convertedText = codeMirror.getValue();

        // 변경 전과 변경 후의 레퍼런스 리스트를 비교 하여
        // 문단의 마지막에서 가장 마지막에 변경 된 레퍼런스를 찾습니다.
        // 이후 해당 레퍼런스 글의 마지막으로 커서를 이동시킵니다.

        const prevReferenceList =
          prevText.match(getRegExp("bracketWithUrl")) || [];
        const convertedReferenceList =
          convertedText.match(getRegExp("bracketWithUrl")) || [];

        let prevIndex = prevReferenceList.length - 1;
        let convertedIndex = convertedReferenceList.length - 1;

        while (
          convertedIndex >= 0 &&
          prevReferenceList[prevIndex] ===
            convertedReferenceList[convertedIndex]
        ) {
          prevIndex--;
          convertedIndex--;
        }

        const lastDiffReference = convertedReferenceList[convertedIndex];
        const { line, ch } = codeMirror.posFromIndex(
          codeMirror.getValue().lastIndexOf(lastDiffReference)
        );

        codeMirror.setCursor({ line, ch: ch + lastDiffReference.length });
        codeMirror.focus();
      }, 0);

      // 변경 후 사용된 id 들을 응답으로 전송 합니다.

      return getUsedReferenceIds(convertedText);
    },

    args: [
      reference.filter((data): data is AttachedReferenceData => data.isWritten),
    ],
  });

  sendResponse({
    status: "ok",
    data: result.result,
  });
};
