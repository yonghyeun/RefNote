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
      className={`flex flex-col gap-2 transition-[height,margin] duration-300 ${isUnAttachedReferenceVisible ? "h-1/2" : "h-0 mb-10"}`}
    >
      <div className="flex justify-between items-end gap-4">
        <h2 className="text-base">
          글에 첨부되지 않은 레퍼런스
          <span className="text-[0.8rem] text-[#a0a0a0] ml-1">
            ({unAttachedReferenceList.length})
          </span>
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
      <UnAttachedReferenceList
        unAttachedReferenceList={unAttachedReferenceList}
      />
    </section>
  );
};
