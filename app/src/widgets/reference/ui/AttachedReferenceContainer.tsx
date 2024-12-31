import { useChromeStorage, useTab } from "@/shared/store";
import styles from "./reference.module.css";
import {
  AutoConvertingToggle,
  CopyReferenceListButton,
  AttachedReferenceList,
} from "@/features/reference/ui";
import { ContentScriptErrorButton } from "@/features/error/ui";

interface AttachedReferenceContainerProps {
  attachedReferenceList: AttachedReferenceData[];
}

export const AttachedReferenceContainer = ({
  attachedReferenceList,
}: AttachedReferenceContainerProps) => {
  const {
    chromeStorage: { isContentScriptEnabled },
  } = useChromeStorage();
  const tab = useTab();

  const isVelogWritePage = tab?.url.includes("https://velog.io/write");

  return (
    <section className={styles.referenceContainer}>
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
