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
    <Button
      onClick={handleClick}
      className={styles.flexOneButton}
      disabled={!(isVelogWritePage && chromeStorage.isContentScriptEnabled)}
    >
      텍스트 전환
    </Button>
  );
};
