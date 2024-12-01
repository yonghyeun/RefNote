type SingleBracket = `[${number}]`;
type DoubleBracket = `[[${number}]]`;
type BracketWithUrl = `[[${number}]](${string})`;
type Url = `(${string})`;

interface WrittenReferenceInfo {
  bracketOnlyMatch: {
    singleBracketMatch: Set<SingleBracket>;
    doubleBracketMatch: Set<DoubleBracket>;
  };
  referenceMatchInSameTag: Set<BracketWithUrl>;
  referenceMatchInNextTag: {
    splitDoubleBracket: DoubleBracket;
    nextNodeUrlMatch: Url;
    nextNode: Node;
  } | null;
}

type DispatchEvent = (
  node: Node,
  eventOption: EventInit & {
    type: string;
  }
) => void;
export const convertToMarkdown = async ({
  tab,
  data,
}: {
  tab: Tab;
  data: ReferenceData[];
}) => {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (attachedReferenceList: AttachedReferenceData[], tab: Tab) => {
      // 어떤 이벤트가 발생하면 해당 노드 밑 자식 노드에 이벤트를 dispatch 시키는 함수
      const dispatchEvent: DispatchEvent = (node, eventOption) => {
        const { type, ...options } = eventOption;
        const event = new Event(type, {
          bubbles: true,
          cancelable: true,
          ...options,
        });

        node.dispatchEvent(event);
        node.parentNode?.dispatchEvent(event);
      };

      /**
       * 해당 메소드는 인수로 받은 currentNode와 다음노드의 textContent의 값을 이용해 다음과 같은 값들을 검출해냅니다.
       * - bracketOnlyMatch.singleBracketMatch : 현재 노드의 textContent에서 [숫자] 형태의 데이터를 검출합니다.
       * - bracketOnlyMatch.doubleBracketMatch : 현재 노드의 textContent에서 [[숫자]] 형태의 데이터를 검출합니다.
       * - referenceMatchInSameTag : 현재 노드의 textContent에서 [[숫자]](url) 형태의 데이터를 검출합니다.
       * - referenceMatchInNextTag.splitDoubleBracket : 현재 노드의 textContent에서 [[숫자]] 형태의 마지막 데이터를 검출합니다.
       * - referenceMatchInNextTag.nextNodeUrlMatch : 다음 노드의 textContent에서 (url) 형태의 데이터를 검출합니다.
       * - referenceMatchInNextTag.nextNode : 다음 노드를 반환합니다.
       *
       * @param currentNode : 탐색 할 현재의 노드
       * @returns WrittenReferenceInfo | null : 해당 노드의 레퍼런스 정보를 반환합니다. 레퍼런스 정보가 없다면 null을 반환합니다.
       */
      const parseReferenceNode = (
        currentNode: Text
      ): WrittenReferenceInfo | null => {
        const bracketOnlySingleRegExp = /(?<!\[)\[\d+\](?!\]|\()/g;
        const bracketOnlyDoubleRegExp = /\[\[\d+\]\](?!\()/g;
        const bracketWithUrlRegExp = /\[\[\d+\]\]\((http[s]?:\/\/[^\s]+)\)/g;
        const firstUrlOnly = /^\(http[s]?:\/\/[^\s]+\)/g;

        const nodeValue = currentNode.nodeValue;
        if (!nodeValue) {
          return null;
        }

        const singleBracketMatch = new Set(
          (nodeValue.match(bracketOnlySingleRegExp) as SingleBracket[]) || []
        );

        const doubleBracketMatch = new Set(
          (nodeValue.match(bracketOnlyDoubleRegExp) as DoubleBracket[]) || []
        );

        const referenceMatchInSameTag = new Set(
          (nodeValue.match(bracketWithUrlRegExp) as BracketWithUrl[]) || []
        );

        // 찾은 레퍼런스 텍스트가 없다면 null 객체를 반환 합니다.
        if (
          [
            singleBracketMatch,
            doubleBracketMatch,
            referenceMatchInSameTag,
          ].every((set) => set.size === 0)
        ) {
          return null;
        }

        const matchResultInOnlySameTag = {
          bracketOnlyMatch: {
            singleBracketMatch,
            doubleBracketMatch,
          },
          referenceMatchInSameTag,
          referenceMatchInNextTag: null,
        };

        if (doubleBracketMatch.size > 0) {
          // [[{number}]] 가 있다면 다음 형제 노드에서 url 이 있는지 확인해야 합니다.
          const nextNode = currentNode.parentNode?.nextSibling?.firstChild;
          if (!nextNode) {
            return matchResultInOnlySameTag;
          }
          const [urlMatchInNextTag] =
            nextNode.nodeValue?.match(firstUrlOnly) || [];
          if (!urlMatchInNextTag) {
            return matchResultInOnlySameTag;
          }
          return {
            bracketOnlyMatch: {
              singleBracketMatch,
              doubleBracketMatch: new Set(
                [...doubleBracketMatch].slice(0, doubleBracketMatch.size - 1)
              ),
            },
            referenceMatchInSameTag,
            referenceMatchInNextTag: {
              splitDoubleBracket: [
                ...doubleBracketMatch,
              ].pop() as DoubleBracket,
              nextNodeUrlMatch: urlMatchInNextTag as Url,
              nextNode,
            },
          };
        }

        return matchResultInOnlySameTag;
      };

      /**
       *
       * @param node : 변경이 일어날 현재 노드
       * @param match : 변경이 일어날 레퍼런스 표기 [{number}] or [[{number}]]
       * @param attachedReferenceList : chrome.storage.sync에 저장된 attachedReference 데이터
       * @returns 만약 표기 된 레퍼런스 아이디가 chromeStorage에 존재 한다면 변경된 textMatch , 존재하지 않는다면 undefined를 반환합니다.
       */
      const convertBracketOnlyToMarkdown = (
        node: Node,
        match: SingleBracket | DoubleBracket,
        attachedReferenceList: AttachedReferenceData[]
      ) => {
        const writtenReferenceId = Number(match.replace(/\[|\]/g, ""));
        const attachedReferenceData = attachedReferenceList.find(
          ({ id }) => id === writtenReferenceId
        );

        if (node.textContent && attachedReferenceData) {
          return node.textContent.replace(
            match,
            `[[${writtenReferenceId}]](${attachedReferenceData.url})`
          );
        }
      };

      const targetBody = document.querySelector("body") as HTMLElement;
      const treeWalker = document.createTreeWalker(
        targetBody,
        NodeFilter.SHOW_TEXT
      );

      while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode as Text;
        const writtenReferenceInfo = parseReferenceNode(node);
        if (!writtenReferenceInfo) {
          continue;
        }

        const {
          bracketOnlyMatch: { singleBracketMatch, doubleBracketMatch },
          referenceMatchInSameTag,
          referenceMatchInNextTag,
        } = writtenReferenceInfo;

        // bracketOnly 데이터들을 변경 합니다.
        // 이 때 attachedReferenceList에 존재하는 데이터만 변경 합니다.
        [...singleBracketMatch, ...doubleBracketMatch].forEach((match) => {
          const writtenReferenceId = Number(match.replace(/\[|\]/g, ""));
          const attachedReferenceData = attachedReferenceList.find(
            ({ id }) => id === writtenReferenceId
          );
          if (!(node.textContent && attachedReferenceData)) {
            return;
          }

          node.textContent = node.textContent?.replace(
            match,
            `[[${writtenReferenceId}]](${attachedReferenceData.url})`
          );
          const event = new InputEvent("keydown", {
            bubbles: true,
            cancelable: true,
            composed: true,
          });
          window.dispatchEvent(event);
        });
      }

      return 1;
    },
    args: [
      data
        .filter((data): data is AttachedReferenceData => data.isWritten)
        .sort((a, b) => a.id - b.id),
      tab,
    ],
  });

  return result.result;
};
