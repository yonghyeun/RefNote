import { UnAttachedReferenceItem } from "./ReferenceItem";
import { useState } from "react";
import styles from "./styles.module.css";

interface UnAttachedReferenceListProps {
  unAttachedReferenceList: UnAttachedReferenceData[];
}

export const UnAttachedReferenceList = ({
  unAttachedReferenceList,
}: UnAttachedReferenceListProps) => {
  const [activeUrl, setIsActiveUrl] = useState<string>("");

  return (
    <ul className={styles.referenceList}>
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
