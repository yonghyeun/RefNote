import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";
import { useTab } from "@/shared/store";
import { sendMessageToBackground } from "@/shared/lib";

export const ConvertToReferenceButton = () => {
  const tab = useTab();

  const handleClick = async () => {
    if (!tab) {
      return;
    }

    if (!tab.url.includes("https://velog.io/write")) {
      sendMessageToBackground<void, string>({
        message: "NotifyError",
        data: "텍스트 전환 기능은 벨로그 글 쓰기 페이지에서만 가능 합니다.",
        tab,
      });
      return;
    }

    try {
      const attachedReferenceList = await sendMessageToBackground<
        AttachedReferenceData[]
      >({
        message: "ConvertToReference",
        tab,
      });

      sendMessageToBackground<void, AttachedReferenceData[]>({
        message: "NotifyConvertProcessSuccess",
        data: attachedReferenceList,
        tab,
      });
    } catch (error) {
      sendMessageToBackground({
        message: "NotifyError",
        data: (error as Error).message,
        tab,
      });
    }
  };

  return (
    <Button onClick={handleClick} className={styles.flexOneButton}>
      텍스트 전환
    </Button>
  );
};
