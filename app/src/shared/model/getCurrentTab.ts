/**
 * chrome.tabs.query 에서 tab이 undefined 일 수 있는 경우는 현재 쿼리문에 해당 하지 않습니다.
 * tab이 undefined 일 수 있는 경우 2가지
 * 1. 쿼리문에 해당하는 tab이 없는 경우, 즉 비활성화되어있고 현재 윈도우가 아닌 경우
 * 2. manifest.json 에서 권한이 올바르게 설정되지 않은 경우
 *
 * tab.id 가 undefined 일 수 있는 경우도 다음과 같습니다.
 * 1. 세션 API를 사용하여 외부 탭을 쿼리하는 경우: 세션 API를 사용하여 외부 탭을 쿼리할 때, tab.id가 없을 수 있습니다. 대신 세션 ID가 있을 수 있습니다.
 * 2. 앱 및 개발자 도구 창에서 탭을 쿼리하는 경우: 앱 및 개발자 도구 창에서 탭을 쿼리할 때, tab.id가 chrome.tabs.TAB_ID_NONE으로 설정될 수 있습니다.
 * 3.탭이 아직 생성되지 않은 경우: 탭이 아직 생성되지 않았거나, 탭이 로드 중인 경우 tab.id가 없을 수 있습니다.
 *
 * 저희의 경우는 모두 해당되지 않으니 타입 단언을 통해 타입을 좁히도록 합니다.
 */
export const getCurrentTab = async (): Promise<Tab> => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab || !tab.id) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("tab 이 존재하지 않습니다.");
    }
    return tab as never;
  }

  return tab as Tab;
};
