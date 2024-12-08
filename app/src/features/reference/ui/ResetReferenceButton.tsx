import { chromeStorageInitialValue } from "@/shared/store/chromeStorage";
import { Button } from "@/shared/ui/button";
import styles from "./styles.module.css";

export const ResetReferenceButton = () => {
  const handleResetReference = () => {
    chrome.storage.sync.set(chromeStorageInitialValue);
  };

  // 색상으로 약간 주의를 줄 수 있는 빨간색 아이콘 버튼을 만들어주세요.

  return (
    <Button
      aria-label="Reset reference"
      className={styles.resetButton}
      onClick={handleResetReference}
    >
      레퍼런스 목록 초기화
    </Button>
  );
};
