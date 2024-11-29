import { useChromeStorage } from "@/shared/store";
import { Button } from "@/shared/ui/button";

export const ConvertToMarkdownButton = () => {
  const { chromeStorage } = useChromeStorage();
  const { isMarkdown } = chromeStorage;

  return <Button disabled={!isMarkdown}>Convert to Markdown</Button>;
};
