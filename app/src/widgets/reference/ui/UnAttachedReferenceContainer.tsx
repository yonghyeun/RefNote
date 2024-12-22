import { useState } from "react";
import styles from "./reference.module.css";
import { UnAttachedReferenceList } from "@/features/reference/ui";
import { Button } from "@/shared/ui/button";

interface UnAttachedReferenceContainerProps {
  unAttachedReferenceList: UnAttachedReferenceData[];
}

export const UnAttachedReferenceContainer = ({
  unAttachedReferenceList,
}: UnAttachedReferenceContainerProps) => {
  const [unAttachedReferenceListVisible, setUnAttachedReferenceListVisible] =
    useState<boolean>(false);

  return (
    <section
      className={`${styles.referenceContainer} ${unAttachedReferenceListVisible ? "" : styles.folded}`}
    >
      <div>
        <h2>
          글에 첨부되지 않은 레퍼런스
          <span>({unAttachedReferenceList.length})</span>
        </h2>
        <Button
          onClick={() => {
            setUnAttachedReferenceListVisible((prev) => !prev);
          }}
          className={styles.foldButton}
        >
          {unAttachedReferenceListVisible ? "접기" : "펼치기"}
        </Button>
      </div>
      {unAttachedReferenceListVisible && (
        <UnAttachedReferenceList
          unAttachedReferenceList={unAttachedReferenceList}
        />
      )}
    </section>
  );
};
