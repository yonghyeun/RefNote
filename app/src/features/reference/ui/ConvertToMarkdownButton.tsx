import { sendMessage } from "@/shared/lib";
import { getCurrentTab } from "@/shared/model";
import { useChromeStorage } from "@/shared/store";
import { Button } from "@/shared/ui/button";

export interface ConvertToMarkdownMessage {
  message: "convertToMarkdown";
  tab: Tab;
  data: ReferenceData[];
}

export const ConvertToMarkdownButton = () => {
  const { chromeStorage } = useChromeStorage();
  const { isMarkdown, reference } = chromeStorage;

  const handleConvertToMarkdown = async () => {
    const tab = await getCurrentTab();

    await sendMessage({
      message: "convertToMarkdown",
      tab,
      data: reference,
    });
  };

  return (
    <Button disabled={!isMarkdown} onClick={handleConvertToMarkdown}>
      Convert to Markdown
    </Button>
  );
};
