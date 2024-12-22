import styles from "./reference.module.css";
import { UnAttachedReferenceList } from "@/features/reference/ui";
import type { ReferenceContainerProps } from "./types";

export const UnAttachedReferenceContainer = ({
  reference,
}: ReferenceContainerProps<UnAttachedReferenceData>) => {
  return (
    <section className={styles.referenceContainer}>
      <h2>
        글에 첨부되지 않은 레퍼런스
        <span>({reference.length})</span>
      </h2>
      <UnAttachedReferenceList unAttachedReferenceList={reference} />
    </section>
  );
};
