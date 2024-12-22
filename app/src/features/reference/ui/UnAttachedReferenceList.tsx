import { ReferenceItem } from "./ReferenceItem";
import { useState } from "react";

interface UnAttachedReferenceListProps {
  unAttachedReferenceList: UnAttachedReferenceData[];
}

export const UnAttachedReferenceList = ({
  unAttachedReferenceList,
}: UnAttachedReferenceListProps) => {
  const [activeUrl, setIsActiveUrl] = useState<string>("");

  return (
    <ul>
      {unAttachedReferenceList.map((reference, idx) => (
        <li key={idx}>
          <ReferenceItem
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
