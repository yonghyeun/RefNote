import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";
import { sendConvertReferenceMessage } from "../model";

export const ConvertToReferenceButton = () => {
  return (
    <Button
      onClick={() => sendConvertReferenceMessage()}
      className={styles.flexOneButton}
    >
      텍스트 전환
    </Button>
  );
};
