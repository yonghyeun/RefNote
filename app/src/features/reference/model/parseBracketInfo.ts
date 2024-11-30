type SingleBracket = `[${number}]`;
type DoubleBracket = `[[${number}]]`;
type BracketWithUrl = `[[${number}]](${string})`;

interface TextContentInfoForConvert {
  bracketOnlyMatch: {
    single: Set<SingleBracket>;
    double: Set<DoubleBracket>;
  };
  referenceMatch: Set<BracketWithUrl>;
}

export const parseBracketInfo = (
  currentNode: Node
): TextContentInfoForConvert => {
  // [{number}] 형태만 파싱하도록 정규표현식 생성
  const bracketOnlySingle = /(?<!\[)\[\d+\](?!\]|\()/g; // [{number}]
  // [[{number}]] 형태만 파싱하도록 정규표현식 생성
  const bracketOnlyDouble = /\[\[\d+\]\](?!\()/g; // [[{number}]] (옆에 (로 시작하지 않도록)
  // [[{number}]]({url}) 형태만 파싱하도록 정규표현식 생성
  const bracketWithUrl = /\[\[\d+\]\]\((http[s]?:\/\/[^\s]+)\)/g; // [[{number}]]({url})

  return {
    bracketOnlyMatch: {
      single: new Set(
        (currentNode.textContent?.match(
          bracketOnlySingle
        ) as SingleBracket[]) || []
      ),
      double: new Set(
        (currentNode.textContent?.match(
          bracketOnlyDouble
        ) as DoubleBracket[]) || []
      ),
    },
    referenceMatch: new Set(
      (currentNode.textContent?.match(bracketWithUrl) as BracketWithUrl[]) || []
    ),
  };
};
