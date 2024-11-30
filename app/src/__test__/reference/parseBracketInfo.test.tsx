import { parseBracketInfo } from "@/features/reference/model";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("한 태그 안에 존재하는 TextContent 조회 테스트", () => {
  const referenceId = 1;
  const url = "http://www.google.com";

  render(
    <div id="content">
      <span data-testid="no-number">치킨의 근본은 황금 올리브 반반이다.</span>
      <span data-testid="no-url-single">
        치킨의 근본은 황금 올리브 반반이다.[{referenceId}]
      </span>
      <span data-testid="no-url-double">
        치킨의 근본은 황금 올리브 반반이다.[[{referenceId}]]
      </span>
      <span data-testid="url-double">
        치킨의 근본은 황금 올리브 반반이다.[[{referenceId}]]({url})
      </span>
      <span data-testid="nested-url">
        치킨의 근본은 황금 올리브 반반이다.[[{referenceId}]]({url}). 그런데
        간간히 허니콤보도 땡긴다.[{referenceId + 1}] 개인적으로 매운 치킨은
        안좋아한다.[[{referenceId + 2}]]
      </span>
    </div>
  );

  const content = document.getElementById("content") as HTMLElement;

  test("textContent에 그 어떤 bracket도 존재하지 않는 경우", () => {
    expect(
      parseBracketInfo(
        content.querySelector('[data-testid="no-number"]') as Node
      )
    ).toMatchObject({
      bracketOnlyMatch: {
        single: new Set(),
        double: new Set(),
      },
      referenceMatch: new Set(),
    });
  });

  test("textContent에 [{number}] 형태의 bracket만 존재하는 경우", () => {
    expect(
      parseBracketInfo(
        content.querySelector('[data-testid="no-url-single"]') as Node
      )
    ).toMatchObject({
      bracketOnlyMatch: {
        single: new Set([`[${referenceId}]`]),
        double: new Set(),
      },
      referenceMatch: new Set(),
    });
  });

  test("textContent에 [[{number}]] 형태의 bracket만 존재하는 경우", () => {
    expect(
      parseBracketInfo(
        content.querySelector('[data-testid="no-url-double"]') as Node
      )
    ).toMatchObject({
      bracketOnlyMatch: {
        single: new Set(),
        double: new Set([`[[${referenceId}]]`]),
      },
      referenceMatch: new Set(),
    });
  });

  test("textContent에 [[{number}]]({url}) 형태의 bracket만 존재하는 경우", () => {
    expect(
      parseBracketInfo(
        content.querySelector('[data-testid="url-double"]') as Node
      )
    ).toMatchObject({
      bracketOnlyMatch: {
        single: new Set(),
        double: new Set(),
      },
      referenceMatch: new Set([`[[${referenceId}]](${url})`]),
    });
  });

  test("textContent에 다양한 bracket이 존재하는 경우", () => {
    expect(
      parseBracketInfo(
        content.querySelector('[data-testid="nested-url"]') as Node
      )
    ).toMatchObject({
      bracketOnlyMatch: {
        single: new Set([`[${referenceId + 1}]`]),
        double: new Set([`[[${referenceId + 2}]]`]),
      },
      referenceMatch: new Set([`[[${referenceId}]](${url})`]),
    });
  });
});
