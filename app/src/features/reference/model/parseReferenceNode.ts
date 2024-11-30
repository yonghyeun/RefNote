type SingleBracket = `[${number}]`;
type DoubleBracket = `[[${number}]]`;
type BracketWithUrl = `[[${number}]](${string})`;
type Url = `(${string})`;

export interface WrittenReferenceInfo {
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
export const parseReferenceNode = (
  currentNode: Node
): WrittenReferenceInfo | null => {
  const bracketOnlySingleRegExp = /(?<!\[)\[\d+\](?!\]|\()/g;
  const bracketOnlyDoubleRegExp = /\[\[\d+\]\](?!\()/g;
  const bracketWithUrlRegExp = /\[\[\d+\]\]\((http[s]?:\/\/[^\s]+)\)/g;
  const firstUrlOnly = /^\(http[s]?:\/\/[^\s]+\)/g;

  const singleBracketMatch = new Set(
    (currentNode.textContent?.match(
      bracketOnlySingleRegExp
    ) as SingleBracket[]) || []
  );

  const doubleBracketMatch = new Set(
    (currentNode.textContent?.match(
      bracketOnlyDoubleRegExp
    ) as DoubleBracket[]) || []
  );

  const referenceMatchInSameTag = new Set(
    (currentNode.textContent?.match(
      bracketWithUrlRegExp
    ) as BracketWithUrl[]) || []
  );

  const nextNode = getNextNode(currentNode);
  const [nextNodeUrlMatch] = nextNode?.textContent?.match(firstUrlOnly) || [];

  if (!nextNode || !nextNodeUrlMatch || doubleBracketMatch.size === 0) {
    // 해당 노드에서 찾은 데이터가 아무것도 없다면 null을 반환 합니다.
    if (singleBracketMatch.size === 0 && doubleBracketMatch.size === 0) {
      return null;
    }

    return {
      bracketOnlyMatch: {
        singleBracketMatch,
        doubleBracketMatch,
      },
      referenceMatchInSameTag,
      referenceMatchInNextTag: null,
    };
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
      nextNode,
      splitDoubleBracket: [...doubleBracketMatch][doubleBracketMatch.size - 1],
      nextNodeUrlMatch: nextNodeUrlMatch as Url,
    },
  };
};

const getNextNode = (currentNode: Node): Node | null => {
  if (currentNode instanceof Element) {
    return (
      currentNode.firstElementChild || currentNode.nextElementSibling || null
    );
  }
  return (
    [...currentNode.childNodes].find((child) => child instanceof Element) ||
    currentNode.nextSibling ||
    null
  );
};
