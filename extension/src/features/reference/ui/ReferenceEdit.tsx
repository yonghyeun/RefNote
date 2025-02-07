import { Button } from "@/shared/ui/button";
import { Reference } from "./Reference";
import { useState } from "react";
import { useChromeSyncStorage } from "@/shared/store";

interface ReferenceEditProps {
  reference: ReferenceData;
  onResolveEdit: () => void;
  className?: string;
}

export const ReferenceEdit = ({
  reference,
  onResolveEdit,
  className = "",
}: ReferenceEditProps) => {
  const [title, setTitle] = useState<string>(() => reference.title);

  const handleSaveReference = () => {
    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: ({ reference: prevReference }) => {
        const changeTargetReference = prevReference.findIndex(
          (r) => r.url === reference.url
        );

        if (changeTargetReference === -1) {
          return { reference: prevReference };
        }

        return {
          reference: [
            ...prevReference.slice(0, changeTargetReference),
            { ...reference, title },
            ...prevReference.slice(changeTargetReference + 1),
          ],
        };
      },
    });
    onResolveEdit();
  };

  return (
    <Reference reference={reference} className={className}>
      <div className="flex gap-1 items-center py-2">
        <Reference.Favicon />
        <div className="flex flex-grow gap-2">
          <input
            placeholder={reference.title}
            type="text"
            value={title}
            className="pb-1 bg-transparent flex-grow 
            border-b
            border-primary  
            focus:outline-none"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSaveReference}>
              저장
            </Button>
            <Button size="sm" onClick={onResolveEdit}>
              취소
            </Button>
          </div>
        </div>
      </div>
    </Reference>
  );
};
