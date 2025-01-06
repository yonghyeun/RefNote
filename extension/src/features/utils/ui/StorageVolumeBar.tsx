import { useEffect, useState } from "react";

/**
 * chrome.storage.sync 의 경우 각 key 별 저장 가능한 최대 크기가 8kb 입니다.
 * 이에 사용 가능 reference를 기준으로 하여 사용량을 표시하는 컴포넌트입니다.
 */
export const StorageVolumeBar = () => {
  const [usedBytes, setUsedBytes] = useState<number>(0);
  const availableBytes = 8 * 1024; //  8kb
  const percentageOfUsed = Math.round((usedBytes / availableBytes) * 100);

  useEffect(() => {
    const updateStorageUsage = () => {
      chrome.storage.sync.getBytesInUse("reference", (bytesInUse) => {
        setUsedBytes(bytesInUse);
      });
    };

    // 초기 용량 업데이트
    updateStorageUsage();

    // 스토리지 변경 감지
    chrome.storage.sync.onChanged.addListener(updateStorageUsage);

    // 클린업 함수
    return () => {
      chrome.storage.sync.onChanged.removeListener(updateStorageUsage);
    };
  }, []);

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-grow bg-gray-200 h-1 rounded-md ">
        <div
          className="h-full rounded-md bg-primary transition-[width] duration-300"
          style={{ width: `${percentageOfUsed}%` }}
        />
      </div>
      <span className="w-8 text-end text-primary">{percentageOfUsed} %</span>
    </div>
  );
};
