import { sendMessage } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";

export const ConvertToReferenceButton = () => {
  const handleConvertToReference = async () => {
    await sendMessage({
      message: "ConvertToReference",
    });
  };

  return (
    <Button onClick={handleConvertToReference} className={styles.flexOneButton}>
      텍스트 전환
    </Button>
  );
};
