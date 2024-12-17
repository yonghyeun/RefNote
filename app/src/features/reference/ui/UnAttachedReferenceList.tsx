import { useChromeStorage } from "@/shared/store";
import { ReferenceItem } from "./ReferenceItem";
import { useState } from "react";

export const UnAttachedReferenceList = () => {
  const [activeUrl, setIsActiveUrl] = useState<string>("");
  const { chromeStorage } = useChromeStorage();
  const { reference } = chromeStorage;

  return (
    <ul>
      {reference
        .filter((data): data is UnAttachedReferenceData => !data.isWritten)
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
