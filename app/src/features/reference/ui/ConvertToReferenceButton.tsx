import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";
import { useChromeStorage, useTab } from "@/shared/store";
import { sendMessageToBackground } from "@/shared/lib";

export const ConvertToReferenceButton = () => {
  const { chromeStorage } = useChromeStorage();
  const tab = useTab();

  const isVelogWritePage = tab?.url.includes("https://velog.io/write");

  const handleClick = async () => {
    if (!tab) {
      return;
    }

    if (!tab.url.includes("https://velog.io/write")) {
      sendMessageToBackground<void, string>({
        message: "NotifyError",
        data: "텍스트 전환 기능은 벨로그 글 쓰기 페이지에서만 가능 합니다.",
      });
      return;
    }

    try {
      const attachedReferenceList = await sendMessageToBackground<
        AttachedReferenceData[]
      >({
        message: "ConvertToReference",
      });

      sendMessageToBackground<void, AttachedReferenceData[]>({
        message: "NotifyConvertProcessSuccess",
        data: attachedReferenceList,
      });
    } catch (error) {
      sendMessageToBackground({
        message: "NotifyError",
        data: (error as Error).message,
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={styles.flexOneButton}
      disabled={!(isVelogWritePage && chromeStorage.isContentScriptEnabled)}
    >
      텍스트 전환
    </Button>
  );
};
