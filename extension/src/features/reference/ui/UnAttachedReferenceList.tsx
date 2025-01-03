import { UnAttachedReferenceItem } from "./ReferenceItem";
import { useState } from "react";

interface UnAttachedReferenceListProps {
  unAttachedReferenceList: UnAttachedReferenceData[];
}

export const UnAttachedReferenceList = ({
  unAttachedReferenceList,
}: UnAttachedReferenceListProps) => {
  const [activeUrl, setIsActiveUrl] = useState<string>("");

  return (
    <ul className="flex-grow overflow-y-auto rounded-md">
      {unAttachedReferenceList.map((reference, idx) => (
        <li key={idx}>
          <UnAttachedReferenceItem
            {...reference}
            isActive={activeUrl === reference.url}
            onClick={() => {
              setIsActiveUrl(activeUrl === reference.url ? "" : reference.url);
            }}
          />
        </li>
      ))}
    </ul>
  );
};
