import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SaveErrorContext {
  errorUrl: ReferenceData["url"];
  setErrorUrl: (url: ReferenceData["url"]) => void;
}

const SaveErrorContext = createContext<SaveErrorContext | null>(null);

export const SaveErrorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [errorUrl, setErrorUrl] = useState<ReferenceData["url"]>("");

  return (
    <SaveErrorContext.Provider
      value={{
        errorUrl,
        setErrorUrl,
      }}
    >
      {children}
    </SaveErrorContext.Provider>
  );
};

export const useSaveErrorUrl = () => {
  const context = useContext(SaveErrorContext);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ERROR_DURATION = 1000;

  if (!context) {
    throw new Error(
      "useSaveErrorUrl 훅은 SaveErrorProvider 내에서 사용되어야 합니다."
    );
  }

  const { errorUrl, setErrorUrl } = context;

  useEffect(() => {
    if (!context.errorUrl) {
      timerRef.current = null;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setErrorUrl("");
    }, ERROR_DURATION);
  }, [errorUrl]);

  return { errorUrl, setErrorUrl };
};
