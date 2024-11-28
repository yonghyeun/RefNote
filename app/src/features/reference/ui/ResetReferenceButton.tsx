import { chromeStorageInitialValue } from "@/shared/store/chromeStorage";

export const ResetReferenceButton = () => {
  const handleResetReference = () => {
    chrome.storage.sync.set(chromeStorageInitialValue);
  };

  return (
    <button aria-label="Reset reference" onClick={handleResetReference}
      className=""
    >
      <svg
        fill="#000000"
        width="1rem"
        height="1rem"
        viewBox="0 0 1920 1920"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M960 0v112.941c467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059-467.125 0-847.059-379.934-847.059-847.059 0-267.106 126.607-515.915 338.824-675.727v393.374h112.94V112.941H0v112.941h342.89C127.058 407.38 0 674.711 0 960c0 529.355 430.645 960 960 960s960-430.645 960-960S1489.355 0 960 0"
          fillRule="evenodd"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
