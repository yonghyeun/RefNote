import { useChromeStorage, useTab } from "@/shared/store";
import {
  AutoConvertingToggle,
  CopyReferenceListButton,
  AttachedReferenceList,
} from "@/features/reference/ui";
import { ContentScriptErrorButton } from "@/features/utils/ui";

export const AttachedReferenceContainer = () => {
  const {
    chromeStorage: {
      isContentScriptEnabled,
      reference,
      isUnAttachedReferenceVisible,
    },
  } = useChromeStorage();
  const tab = useTab();

  const isVelogWritePage = tab?.url.includes("https://velog.io/write");

  const attachedReferenceList = reference.filter(
    (data): data is AttachedReferenceData => data.isWritten
  );

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
      <div>
        {isVelogWritePage && !isContentScriptEnabled ? (
          <ContentScriptErrorButton tab={tab} />
        ) : (
          <CopyReferenceListButton
            attachedReferenceList={attachedReferenceList}
          />
        )}
      </div>
      <AttachedReferenceList attachedReferenceList={attachedReferenceList} />
    </section>
  );
};
