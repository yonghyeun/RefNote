import { useChromeStorage } from "@/shared/store";
import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";

export const CopyReferenceListButton = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  const handleCopyReferenceList = () => {
    const attachedReferences = [
      ...reference.filter(
        (data): data is AttachedReferenceData => data.isWritten
      ),
    ].sort((a, b) => a.id - b.id);

    // 마크다운 모드라면 마크다운 문법에 맞게 anchor tag를 만들어줍니다.
    // 마크다운 모드가 아니라면 일반 텍스트로 만들어줍니다.
    const result = attachedReferences.map(
      ({ title, url, id }) => `[${id}. ${title}](${url})`
    );

    // 클립보드에 복사합니다.
    navigator.clipboard.writeText(result.join("\n"));
    chrome.notifications.create(
      "codeMirror",
      {
        type: "basic",
        iconUrl: "/icon/128.png",
        title: "복사 완료",
        message: `${reference.filter(({ isWritten }) => isWritten).length} 개의 레퍼런스 목록이 복사되었습니다.`,
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
