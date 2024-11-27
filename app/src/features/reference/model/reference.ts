/**
 * 동기적으로 document에서 정보를 가져오는 함수
 */
const getReferenceData = (): ReferenceData => {
  return {
    title: document.title,
    url: document.URL,
    faviconUrl: (document.querySelector('link[rel="icon"]') as HTMLLinkElement)
      ?.href,
    date: new Date().getTime(),
    isPicked: false,
  };
};

/**
 * tabId 에 해당하는 ReferenceData 객체를 chrome.storage.sync 에 저장합니다.
 * @param tabId : contentScript 가 실행된 tabId
 * @returns : 저장된 referenceData
 */
export const saveReferenceOnTab = async (
  tabId: NonNullable<chrome.tabs.Tab["id"]>
) => {
  // tabId에 해당하는 탭에서 title, url, faviconUrl, date 정보를 가져옵니다.
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: getReferenceData,
  });
  const newReferenceData = result.result as ReferenceData;

  // 기존에 저장된 데이터를 가져옵니다.
  // key 값을 null 로 하면 모든 데이터를 가져옵니다.
  const oldValue = await chrome.storage.sync.get(null);
  const changedReferenceData = {
    ...oldValue.referenceData,
    [newReferenceData.date]: newReferenceData,
  };

  // referenceData를 저장합니다.
  // 이 때 여러 브라우저에서 접근 가능하도록 sync storage를 사용합니다.
  // ! sync storage는 최대 100kb , 최대 512개의 항목을 저장 할 수 있다.
  // 인덱스 역할을 할 key 값은 date로 설정합니다.
  await chrome.storage.sync.set<{ referenceData: ReferenceData }>({
    ...oldValue,
    referenceData: changedReferenceData,
  });

  return changedReferenceData;
};
