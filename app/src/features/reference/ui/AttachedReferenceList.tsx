import { useChromeStorage, useTab } from "@/shared/store";
import { ReferenceItem } from "./ReferenceItem";
import { useEffect, useState } from "react";
import { sendConvertReferenceMessage } from "../model";

export const AttachedReferenceList = () => {
  const [activeUrl, setIsActiveUrl] = useState<string>("");
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;
  const tab = useTab();

  useEffect(() => {
    if (!tab?.url?.includes("https://velog.io/write")) {
      return;
    }
    sendConvertReferenceMessage();
  }, [reference]);

  return (
    <ul>
      {reference
        .filter((data): data is AttachedReferenceData => data.isWritten)
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
