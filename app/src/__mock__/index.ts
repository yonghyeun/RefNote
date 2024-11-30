export const mockChromeStorageData: ChromeStorage = {
  reference: [
    // UnWrittenReferenceData
    {
      title: "구글 입니다",
      url: "http://www.google.com",
      faviconUrl: "http://www.google.com/favicon.ico",
      isWritten: false,
    },
    // WrittenReferenceData
    {
      id: 1,
      title: "네이버입니다",
      faviconUrl: "http://www.naver.com/favicon.ico",
      url: "http://www.naver.com",
      isWritten: true,
    },
    {
      id: 2,
      title: "구글입니다",
      faviconUrl: "http://www.google.com/favicon.ico",
      url: "http://www.google.com",
      isWritten: true,
    },
  ],
  isMarkdown: true,
};
