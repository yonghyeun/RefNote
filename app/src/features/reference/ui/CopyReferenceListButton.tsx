import { useChromeStorage } from "@/shared/store";
import { Button } from "@/shared/ui/button";
export const CopyReferenceListButton = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  const handleCopyReferenceList = () => {
    const attachedReferences = reference.filter(
      (data): data is AttachedReferenceData => data.isWritten
    );

    // 마크다운 모드라면 마크다운 문법에 맞게 anchor tag를 만들어줍니다.
    // 마크다운 모드가 아니라면 일반 텍스트로 만들어줍니다.
    const result = attachedReferences.map(
      ({ title, url, id }) => `[${id}. ${title}](${url})`
    );

    // 클립보드에 복사합니다.
    navigator.clipboard.writeText(result.join("\n"));
    // TODO 클립 보드에 복사 되었다면 알림을 띄워줍니다.
  };

  return <Button onClick={handleCopyReferenceList}>목록 복사</Button>;
};
