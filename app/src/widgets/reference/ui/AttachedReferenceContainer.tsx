import styles from "./reference.module.css";
import {
  AutoConvertingToggle,
  CopyReferenceListButton,
  AttachedReferenceList,
} from "@/features/reference/ui";

interface AttachedReferenceContainerProps {
  attachedReferenceList: AttachedReferenceData[];
}

export const AttachedReferenceContainer = ({
  attachedReferenceList,
}: AttachedReferenceContainerProps) => {
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
        <CopyReferenceListButton
          attachedReferenceList={attachedReferenceList}
        />
      </div>
      <AttachedReferenceList attachedReferenceList={attachedReferenceList} />
    </section>
  );
};
