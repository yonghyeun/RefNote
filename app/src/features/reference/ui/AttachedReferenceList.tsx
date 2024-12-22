import { useTab } from "@/shared/store";
import { ReferenceItem } from "./ReferenceItem";
import { useEffect, useState } from "react";
import { sendConvertReferenceMessage } from "../model";

interface AttachedReferenceListProps {
  attachedReferenceList: AttachedReferenceData[];
}

export const AttachedReferenceList = ({
  attachedReferenceList,
}: AttachedReferenceListProps) => {
  const [activeUrl, setIsActiveUrl] = useState<string>("");
  const tab = useTab();

  useEffect(() => {
    if (!tab?.url?.includes("https://velog.io/write")) {
      return;
    }
    sendConvertReferenceMessage();
  }, [attachedReferenceList]);

  return (
    <ul>
      {attachedReferenceList
        .sort((prev, cur) => prev.id - cur.id)
        .map((reference, idx) => (
          <li key={idx}>
            <ReferenceItem
              {...reference}
              isActive={activeUrl === reference.url}
              onClick={() => {
                setIsActiveUrl(
                  activeUrl === reference.url ? "" : reference.url
                );
              }}
            />
          </li>
        ))}
    </ul>
  );
};
