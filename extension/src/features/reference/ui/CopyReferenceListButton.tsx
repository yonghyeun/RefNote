import { useChromeSyncStorage } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import { toastMessage } from "@/shared/lib";

export const CopyReferenceListButton = () => {
  const attachedReferences = useChromeSyncStorage((state) =>
    state.reference.filter((data) => data.isWritten)
  );

  const handleCopyReferenceList = () => {
    navigator.clipboard.writeText(
      attachedReferences
        .sort((a, b) => a.id - b.id)
        .map(({ title, url, id }) => `${id}. [${title}](${url})`)
        .join("\n")
    );

    toastMessage(
      {
        toastKey: "copyReferenceList",
        message: `${attachedReferences.length} 개의 레퍼런스 목록이 복사되었습니다.`,
        title: "복사 완료",
      },
      1500
    );
  };

  return (
    <Button onClick={handleCopyReferenceList} className="flex-grow">
      목록 복사
    </Button>
  );
};
