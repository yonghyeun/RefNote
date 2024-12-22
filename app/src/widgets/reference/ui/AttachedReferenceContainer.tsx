import type { ReferenceContainerProps } from "./types";
import styles from "./reference.module.css";
import {
  AutoConvertingToggle,
  CopyReferenceListButton,
  AttachedReferenceList,
} from "@/features/reference/ui";

export const AttachedReferenceContainer = ({
  reference,
}: ReferenceContainerProps<AttachedReferenceData>) => {
  return (
    <section className={styles.referenceContainer}>
      <div>
        <h2>
          글에 첨부된 레퍼런스
          <span>({reference.length})</span>
        </h2>
        <AutoConvertingToggle />
      </div>
      <div>
        <CopyReferenceListButton attachedReferenceList={reference} />
      </div>
      <AttachedReferenceList attachedReferenceList={reference} />
    </section>
  );
};
