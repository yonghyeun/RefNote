import { useChromeStorage, useTab } from "@/shared/store";
import { ReferenceItem } from "./ReferenceItem";
import { useEffect } from "react";
import { sendMessage } from "@/shared/lib";

export const AttachedReferenceList = () => {
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;
  const tab = useTab();

  useEffect(() => {
    if (!tab?.url?.includes("https://velog.io/write")) {
      return;
    }

    sendMessage({
      message: "ConvertToReference",
    });
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
