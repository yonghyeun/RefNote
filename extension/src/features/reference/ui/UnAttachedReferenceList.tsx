import { useState } from "react";
import { ReferenceItem } from "@/features/reference/ui";

interface UnAttachedReferenceListProps {
  unAttachedReferenceList: UnAttachedReferenceData[];
}

export const UnAttachedReferenceList = ({
  unAttachedReferenceList,
}: UnAttachedReferenceListProps) => {
  const [activeUrl, setActiveUrl] = useState<string>("");

  const handleClick = (url: string) => {
    setActiveUrl((prev) => (prev === url ? "" : url));
  };

  return (
    <ul className="flex-grow overflow-y-auto rounded-md">
      {unAttachedReferenceList.map(({ url, title, faviconUrl }) => (
        <ReferenceItem key={url} onClick={() => handleClick(url)}>
          <ReferenceItem.Align>
            <ReferenceItem.Favicon faviconUrl={faviconUrl} />
            <ReferenceItem.Title>{title}</ReferenceItem.Title>
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
