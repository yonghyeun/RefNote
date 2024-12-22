import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";

interface CopyReferenceListButtonProps {
  attachedReferenceList: AttachedReferenceData[];
}

export const CopyReferenceListButton = ({
  attachedReferenceList,
}: CopyReferenceListButtonProps) => {
  const handleCopyReferenceList = () => {
    const attachedReferences = [...attachedReferenceList].sort(
      (a, b) => a.id - b.id
    );

    const result = attachedReferences.map(
      ({ title, url, id }) => `${id}. [${title}](${url})`
    );

    // 클립보드에 복사합니다.
    navigator.clipboard.writeText(result.join("\n"));
    chrome.notifications.create(
      "codeMirror",
      {
        type: "basic",
        iconUrl: "/icon/128.png",
        title: "복사 완료",
        message: `${attachedReferenceList.length} 개의 레퍼런스 목록이 복사되었습니다.`,
        silent: true,
      },
      () => {
        setTimeout(() => {
          chrome.notifications.clear("codeMirror");
        }, 1000);
      }
    );
  };

  return (
    <Button onClick={handleCopyReferenceList} className={styles.flexOneButton}>
      목록 복사
    </Button>
  );
};
