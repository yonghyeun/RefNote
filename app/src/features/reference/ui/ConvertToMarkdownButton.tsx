import { sendMessage } from "@/shared/lib";
import { getCurrentTab } from "@/shared/model";
import { useChromeStorage } from "@/shared/store";
import { Button } from "@/shared/ui/button";

export const ConvertToMarkdownButton = () => {
  const { chromeStorage } = useChromeStorage();
  const { isMarkdown, reference } = chromeStorage;

  const handleConvertToMarkdown = async () => {
    const tab = await getCurrentTab();
    await sendMessage({
      message: "convertToMarkdown",
      tabId: tab.id,
      data: reference,
    });
  };

  return (
    <Button disabled={!isMarkdown} onClick={handleConvertToMarkdown}>
      Convert to Markdown
    </Button>
  );
};
