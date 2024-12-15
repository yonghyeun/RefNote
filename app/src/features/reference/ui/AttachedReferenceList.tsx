import { useChromeStorage, useTab } from "@/shared/store";
import { ReferenceItem } from "./ReferenceItem";
import { useEffect } from "react";
import { sendConvertReferenceMessage } from "../model";

export const AttachedReferenceList = () => {
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
            <ReferenceItem {...reference} />
          </li>
        ))}
    </ul>
  );
};
