import { sendMessage } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";

export const ConvertToReferenceButton = () => {
  const handleCovertToReference = async () => {
    await sendMessage({
      message: "CovertToReference",
    });
  };

  return (
    <Button onClick={handleCovertToReference} className={styles.flexOneButton}>
      텍스트 전환
    </Button>
  );
};
