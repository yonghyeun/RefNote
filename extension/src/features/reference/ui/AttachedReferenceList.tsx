import { useTab } from "@/shared/store";
import { useEffect, useState } from "react";
import { sendMessageToBackground } from "@/shared/lib";
import { ReferenceItem } from "./ReferenceItem";

interface AttachedReferenceListProps {
  attachedReferenceList: AttachedReferenceData[];
}

export const AttachedReferenceList = ({
  attachedReferenceList,
}: AttachedReferenceListProps) => {
  const [activeUrl, setActiveUrl] = useState<string>("");
  const tab = useTab();
  const isVelogWritePage = tab?.url.includes("velog.io/write");

  const handleClick = (url: string) => {
    setActiveUrl((prev) => (prev === url ? "" : url));
  };

  useEffect(() => {
    (async () => {
      if (!tab || !tab.url.includes("https://velog.io/write")) {
        return;
      }

      try {
        const attachedReferenceList = await sendMessageToBackground<
          AttachedReferenceData[]
        >({
          message: "ConvertToReference",
        });

        sendMessageToBackground<void, AttachedReferenceData[]>({
          message: "NotifyConvertProcessSuccess",
          data: attachedReferenceList,
        });
      } catch (error) {
        sendMessageToBackground({
          message: "NotifyError",
          data: (error as Error).message,
        });
      }
    })();
  }, [attachedReferenceList, tab]);

  return (
    <ul className="flex-grow overflow-y-auto rounded-md">
      {attachedReferenceList.map(({ url, title, faviconUrl, isUsed, id }) => (
        <ReferenceItem key={url} onClick={() => handleClick(url)}>
          <ReferenceItem.Align>
            <ReferenceItem.Favicon faviconUrl={faviconUrl} />
            <ReferenceItem.Title>{title}</ReferenceItem.Title>
            <span className="text-[0.8rem] text-gray-400 flex gap-1">
              <span
                className={`text-primary
              ${isVelogWritePage && isUsed ? "" : "hidden"}`}
              >
                ✔
              </span>
              [{id}]
            </span>
            <ReferenceItem.WriteButton title={title} />
            <ReferenceItem.RemoveButton title={title} />
          </ReferenceItem.Align>
          {url === activeUrl && (
            <ReferenceItem.Align className="gap-2">
              <ReferenceItem.CopyLinkButton url={url} />
              <ReferenceItem.CopyLinkWithTextButton url={url} title={title} />
              <ReferenceItem.MovePageButton url={url} />
            </ReferenceItem.Align>
          )}
        </ReferenceItem>
      ))}
    </ul>
  );
};
