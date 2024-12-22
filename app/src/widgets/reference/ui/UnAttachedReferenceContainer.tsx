import { useState } from "react";
import styles from "./reference.module.css";
import { UnAttachedReferenceList } from "@/features/reference/ui";
import { Button } from "@/shared/ui/button";
import { useChromeStorage } from "@/shared/store";

interface UnAttachedReferenceContainerProps {
  unAttachedReferenceList: UnAttachedReferenceData[];
}

export const UnAttachedReferenceContainer = ({
  unAttachedReferenceList,
}: UnAttachedReferenceContainerProps) => {
  const {
    chromeStorage: { unAttachedIsVisible },
    setChromeStorage,
  } = useChromeStorage();

  return (
    <section
      className={`${styles.referenceContainer} ${unAttachedIsVisible ? "" : styles.folded}`}
    >
      <div>
        <h2>
          글에 첨부되지 않은 레퍼런스
          <span>({unAttachedReferenceList.length})</span>
        </h2>
        <Button
          onClick={() => {
            setChromeStorage((prev) => ({
              ...prev,
              unAttachedIsVisible: !unAttachedIsVisible,
            }));
          }}
          className={styles.foldButton}
        >
          {unAttachedIsVisible ? "접기" : "펼치기"}
        </Button>
      </div>
      {unAttachedIsVisible && (
        <UnAttachedReferenceList
          unAttachedReferenceList={unAttachedReferenceList}
        />
      )}
    </section>
  );
};
