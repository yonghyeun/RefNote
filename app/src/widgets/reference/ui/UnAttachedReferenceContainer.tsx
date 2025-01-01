import styles from "./reference.module.css";
import { UnAttachedReferenceList } from "@/features/reference/ui";
import { Button } from "@/shared/ui/button";
import { useChromeStorage } from "@/shared/store";

export const UnAttachedReferenceContainer = () => {
  const {
    chromeStorage: { isUnAttachedReferenceVisible, reference },
    setChromeStorage,
  } = useChromeStorage();

  const unAttachedReferenceList = reference.filter(
    (data): data is UnAttachedReferenceData => !data.isWritten
  );

  return (
    <section
      className={`${styles.referenceContainer} ${isUnAttachedReferenceVisible ? "" : styles.folded}`}
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
              isUnAttachedReferenceVisible: !isUnAttachedReferenceVisible,
            }));
          }}
          aria-label={
            isUnAttachedReferenceVisible
              ? "글에 첨부하지 않은 레퍼런스 리스트 목록 보기"
              : "글에 첨부하지 않은 레퍼런스 리스트 목록 숨기기"
          }
        >
          {isUnAttachedReferenceVisible ? "▲" : "▼"}
        </Button>
      </div>
      {isUnAttachedReferenceVisible && (
        <UnAttachedReferenceList
          unAttachedReferenceList={unAttachedReferenceList}
        />
      )}
    </section>
  );
};
