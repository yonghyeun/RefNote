import { useEffect } from "react";
import {
  AutoConvertingToggle,
  AttachedReferenceList,
} from "@/features/reference/ui";
import { useChromeStorage, useTab } from "@/shared/store";

export const AttachedReferenceContainer = () => {
  const {
    chromeStorage: {
      isContentScriptEnabled,
      reference,
      isUnAttachedReferenceVisible,
    },
  } = useChromeStorage();
  const tab = useTab();

  const attachedReferenceList = reference.filter(
    (data): data is AttachedReferenceData => data.isWritten
  );

  // 만약 글 쓰기 페이지이지만 content script가 올바르게 삽입 되지 않았다면
  // 페이지를 새로고침하여 content script를 다시 삽입합니다.

  useEffect(() => {
    if (
      tab &&
      tab.url.includes("https://velog.io/write") &&
      !isContentScriptEnabled
    ) {
      chrome.tabs.reload(tab.id);
    }
  }, [tab, isContentScriptEnabled]);

  return (
    <section
      className={`h-1/2 flex flex-col gap-2 ${
        isUnAttachedReferenceVisible ? "" : "flex-grow"
      }`}
    >
      <div className="flex justify-between items-end gap-4">
        <h2 className="text-base">
          글에 첨부된 레퍼런스
          <span className="text-[0.8rem] text-[#a0a0a0] ml-1">
            ({attachedReferenceList.length})
          </span>
        </h2>
        <AutoConvertingToggle />
      </div>
      <AttachedReferenceList attachedReferenceList={attachedReferenceList} />
    </section>
  );
};
