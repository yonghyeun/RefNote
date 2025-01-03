import { Button } from "@/shared/ui/button";
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
    <Button
      className={`flex-grow flex-shrink-0 bg-red text-text border-none font-medium px-4 py-2 text-center no-underline inline-block cursor-pointer
      hover:bg-red-hover hover:text-text-hover
      focus-visible:bg-red-hover focus-visible:text-text-hover
      active:bg-red-active active:text-text-hover
      disabled:pointer-events-none disabled:bg-red-disabled disabled:text-text-disabled`}
      onClick={handleClick}
    >
      새로고침 후 이용해 주세요 (새로고침)
    </Button>
  );
};
