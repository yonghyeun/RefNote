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
