import { useTab } from "@/shared/store";
import { AttachedReferenceItem } from "./ReferenceItem";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { sendMessageToBackground } from "@/shared/lib";

interface AttachedReferenceListProps {
  attachedReferenceList: AttachedReferenceData[];
}

export const AttachedReferenceList = ({
  attachedReferenceList,
}: AttachedReferenceListProps) => {
  const [activeUrl, setIsActiveUrl] = useState<string>("");
  const tab = useTab();

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
          tab,
        });

        sendMessageToBackground<void, AttachedReferenceData[]>({
          message: "NotifyConvertProcessSuccess",
          data: attachedReferenceList,
          tab,
        });
      } catch (error) {
        sendMessageToBackground({
          message: "NotifyError",
          data: (error as Error).message,
          tab,
        });
      }
    })();
  }, [attachedReferenceList, tab]);

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
