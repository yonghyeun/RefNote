import { useChromeStorage, useTab } from "@/shared/store";
import styles from "./reference.module.css";
import {
  AutoConvertingToggle,
  CopyReferenceListButton,
  AttachedReferenceList,
} from "@/features/reference/ui";
import { ContentScriptErrorButton } from "@/features/error/ui";

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
      className={`${styles.referenceContainer} ${
        isUnAttachedReferenceVisible ? "" : styles.flexGrow
      }`}
    >
      <div>
        <h2>
          글에 첨부된 레퍼런스
          <span>({attachedReferenceList.length})</span>
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
