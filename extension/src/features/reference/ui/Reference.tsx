import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.css";
import { useChromeSyncStorage } from "@/shared/store/chromeSyncStorage";
import { Button, IconButton } from "@/shared/ui/button";
import { useChromeLocalStorage } from "@/shared/store";

const ReferenceProvider = createContext<ReferenceData | null>(null);

const useReferenceContext = () => {
  const context = useContext(ReferenceProvider);
  if (!context) {
    return useContext(ReferenceProvider)!;
  }
  return context;
};

interface ReferenceProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
  className?: string;
  reference: ReferenceData;
}

const ReferenceItemWrapper = ({
  children,
  onClick,
  reference,
  className = "",
}: ReferenceProps) => {
  return (
    <ReferenceProvider.Provider value={reference}>
      <li
        className={`reference cursor-pointer py-1 flex flex-col justify-center gap-2 ${className}`}
        onClick={onClick}
      >
        {children}
      </li>
    </ReferenceProvider.Provider>
  );
};

const Favicon = () => {
  const reference = useReferenceContext();

  return (
    <img className="w-4 h-4 object-cover mr-2" src={reference.faviconUrl} />
  );
};

const Title = () => {
  const reference = useReferenceContext();
  const [isEllipsis, setIsEllipsis] = useState<boolean>(true);

  return (
    <p
      className={`indent-1 flex-grow ${isEllipsis ? styles.ellipsis : ""}`}
      onClick={() => setIsEllipsis((prev) => !prev)}
    >
      {reference.title}
    </p>
  );
};

const WriteButton = () => {
  const reference = useReferenceContext();

  const handleWriteReference = () => {
    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: ({ reference: prevReference }) => {
        const nextWrittenId =
          prevReference.filter(({ isWritten }) => isWritten).length + 1;

        return {
          reference: prevReference
            .filter(({ url }) => url !== reference.url)
            .concat({
              ...reference,
              isWritten: true,
              isUsed: false,
              id: nextWrittenId,
            }),
        };
      },
    });
  };

  return (
    <IconButton
      aria-label={`${reference.title}에 대한 레퍼런스 사용하기`}
      onClick={handleWriteReference}
    >
      <svg
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
};

const EraseButton = () => {
  const reference = useReferenceContext();

  if (!reference.isWritten) {
    throw new Error(
      "Erase Button 은 AttachedReferenceData에서만 사용 가능 합니다."
    );
  }

  const handleEraseReference = () => {
    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: ({ reference: prevReference }) => {
        const { isUsed, id, isWritten, ...data } = reference;

        return {
          reference: prevReference
            .filter(({ url }) => url !== reference.url)
            .map((data) =>
              data.isWritten
                ? {
                    ...data,
                    id: data.id > reference.id ? data.id - 1 : data.id,
                  }
                : data
            )
            .concat({
              ...data,
              isWritten: false,
            }),
        };
      },
    });
  };

  return (
    <IconButton
      aria-label={`${reference.title}에 대한 레퍼런스 사용하지 않기`}
      onClick={handleEraseReference}
    >
      <svg
        fill="#000000"
        width="1rem"
        height="1rem"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 612.002 612.002"
      >
        <g>
          <path
            d="M594.464,534.414H344.219L606.866,271.77c6.848-6.851,6.848-17.953,0-24.8L407.547,47.65
      c-3.291-3.288-7.749-5.135-12.401-5.135c-4.65,0-9.11,1.847-12.398,5.135L5.138,425.262c-6.851,6.848-6.851,17.95,0,24.8
      l114.29,114.287c3.288,3.291,7.749,5.138,12.398,5.138h462.638c9.684,0,17.536-7.852,17.536-17.536
      C612,542.265,604.148,534.414,594.464,534.414z M395.145,84.851L569.664,259.37L363.27,465.763L188.753,291.245L395.145,84.851z
      M294.618,534.414H139.09L42.336,437.66l121.617-121.617l174.519,174.519L294.618,534.414z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </IconButton>
  );
};

const RemoveButton = () => {
  const reference = useReferenceContext();

  const handleRemoveReference = () => {
    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: ({ reference: prevReference }) => {
        const removeTarget = prevReference.find(
          (data) => data.url === reference.url
        ) as ReferenceData;

        return {
          reference: prevReference
            .filter((data) => data.url !== reference.url)
            .map((data) => {
              if (
                data.isWritten &&
                removeTarget.isWritten &&
                data.id > removeTarget.id
              ) {
                return { ...data, id: data.id - 1 };
              }
              return data;
            }),
        };
      },
    });

    useChromeLocalStorage.dispatchAction({
      type: "remove",
      key: reference.url,
    });
  };

  return (
    <IconButton
      aria-label={`${reference.title}에 대한 레퍼런스 기록 삭제 하기`}
      onClick={handleRemoveReference}
    >
      <svg
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
};

const CustomButton = ({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<typeof Button>) => (
  <Button size="sm" className="flex-grow" {...props}>
    {children}
  </Button>
);

const CopyLinkButton = () => {
  const reference = useReferenceContext();
  return (
    <CustomButton
      onClick={() => {
        navigator.clipboard.writeText(reference.url);
      }}
    >
      링크 복사
    </CustomButton>
  );
};

const CopyLinkWithTextButton = () => {
  const reference = useReferenceContext();
  return (
    <CustomButton
      onClick={() => {
        navigator.clipboard.writeText(`[${reference.title}](${reference.url})`);
      }}
    >
      [제목](링크) 복사
    </CustomButton>
  );
};

const MovePageButton = () => {
  const reference = useReferenceContext();

  return (
    <CustomButton
      onClick={() => {
        window.open(reference.url, "_blank");
      }}
    >
      페이지로 이동
    </CustomButton>
  );
};

const MemoArea = () => {
  const { url } = useReferenceContext();
  const text = useChromeLocalStorage((state) => state[url] || "");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const synchronizeText = async () => {
      if (textAreaRef.current) {
        const storage = await useChromeLocalStorage.synchronizeStore();
        textAreaRef.current.value = storage[url] || "";
      }
    };

    window.addEventListener("focus", synchronizeText);
    return () => {
      window.removeEventListener("focus", synchronizeText);
    };
  }, []);

  return (
    <textarea
      ref={textAreaRef}
      name={`${url}-memo`}
      id={url}
      onClick={(event) => {
        event.stopPropagation();
      }}
      onChange={({ target }) => {
        useChromeLocalStorage.dispatchAction({
          type: "set",
          setter: () => {
            return { [url]: target.value };
          },
        });
      }}
      defaultValue={text}
      className="w-full text-[0.8rem] focus:outline-none bg-transparent rounded-lg p-2 h-24"
    />
  );
};

export const Reference = Object.assign(ReferenceItemWrapper, {
  Favicon,
  Title,
  WriteButton,
  EraseButton,
  RemoveButton,
  CopyLinkButton,
  CopyLinkWithTextButton,
  MovePageButton,
  CustomButton,
  MemoArea,
});
