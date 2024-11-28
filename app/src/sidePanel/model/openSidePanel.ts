/**
 * 해당 핸들러는 popUp에서 openSidePanel 메시지를 받아
 * 해당 확장 프로그램을 팝업이 아닌 sidePanel 로 변경해주는 역할을 합니다.
 */
export const openSidePanel = async (tabId: RequestMessage["tabId"]) => {
  // sidePanel을 열기 위해 sidePanel API를 사용합니다.
  // 해당 메시지를 보낸 sender 의 tabId 를 이용해 sidePanel을 열어줍니다.
  // ! tabId 는  탭에서 열리는 사이드 패널 , windowId 는 전역에서 열리는 사이드 패널입니다.
  await chrome.sidePanel.open({
    tabId,
  });
  // 사이드 패널은 탭이 변경 되어도 계속 열려 있도록 설정 합니다.
  await chrome.sidePanel.setOptions({
    enabled: true,
    path: "src/side_panel.html",
    tabId,
  });
};
