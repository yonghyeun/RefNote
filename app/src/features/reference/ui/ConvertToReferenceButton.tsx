import { sendMessage } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";

export const ConvertToReferenceButton = () => {
  const handleConvertToReference = async () => {
    const { status, data } = await sendMessage({
      message: "ConvertToReference",
    });

    if (status !== "ok") {
      sendMessage({
        message: "NotifyError",
        data,
      });
    }
  };

  return (
    <Button onClick={handleConvertToReference} className={styles.flexOneButton}>
      텍스트 전환
    </Button>
  );
};
