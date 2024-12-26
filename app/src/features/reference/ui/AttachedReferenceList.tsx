import { useTab } from "@/shared/store";
import { AttachedReferenceItem } from "./ReferenceItem";
import { useEffect, useState } from "react";
import { sendConvertReferenceMessage } from "../model";
import styles from "./styles.module.css";

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
    <ul className={styles.referenceList}>
      {attachedReferenceList
        .sort((prev, cur) => prev.id - cur.id)
        .map((reference, idx) => (
          <li key={idx}>
            <AttachedReferenceItem
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
