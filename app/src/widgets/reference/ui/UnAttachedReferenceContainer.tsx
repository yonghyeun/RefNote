import styles from "./reference.module.css";
import { UnAttachedReferenceList } from "@/features/reference/ui";

interface UnAttachedReferenceContainerProps {
  unAttachedReferenceList: UnAttachedReferenceData[];
}

export const UnAttachedReferenceContainer = ({
  unAttachedReferenceList,
}: UnAttachedReferenceContainerProps) => {
  return (
    <section className={styles.referenceContainer}>
      <h2>
        글에 첨부되지 않은 레퍼런스
        <span>({unAttachedReferenceList.length})</span>
      </h2>
      <UnAttachedReferenceList
        unAttachedReferenceList={unAttachedReferenceList}
      />
    </section>
  );
};
