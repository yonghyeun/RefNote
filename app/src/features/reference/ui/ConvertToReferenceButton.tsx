import { sendMessage } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

export const ConvertToReferenceButton = () => {
  const handleCovertToReference = async () => {
    await sendMessage({
      message: "CovertToReference",
    });
  };

  return <Button onClick={handleCovertToReference}>레퍼런스 문법 변환</Button>;
};
