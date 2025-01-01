import { Button } from "@/shared/ui/button";
import styles from "./error.styles.module.css";
interface ContentScriptErrorButtonProps {
  tab: Tab | null;
}

export const ContentScriptErrorButton = ({
  tab,
}: ContentScriptErrorButtonProps) => {
  const handleClick = () => {
    if (!tab) {
      return;
    }

    chrome.tabs.reload(tab.id);
  };

  return (
    <Button className={styles.contentScriptErrorButton} onClick={handleClick}>
      새로고침 후 이용해 주세요 (새로고침)
    </Button>
  );
};
