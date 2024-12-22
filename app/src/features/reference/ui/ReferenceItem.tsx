import React, { useState } from "react";
import styles from "./styles.module.css";
import { useChromeStorage } from "@/shared/store/chromeStorage";
import { IconButton } from "@/shared/ui/button";
import { useTab } from "@/shared/store";

const Favicon = ({
  faviconUrl,
}: {
  faviconUrl: NonNullable<ReferenceData["faviconUrl"]>;
}) => <img className={styles.favicon} src={faviconUrl} />;

// TODO 적절한 파비콘 아이콘 선택 하기
const DefaultFavicon = () => (
  <img className={styles.favicon} src="/icon/128.png" />
);

interface ContentProps {
  children: React.ReactNode;
  onClick: () => void;
}
const Content = ({ children, onClick }: ContentProps) => (
  <div className="content" onClick={onClick}>
    {children}
  </div>
);

const Title = ({ children }: { children: React.ReactNode }) => {
  const [isEllipsis, setIsEllipsis] = useState<boolean>(true);

  return (
    <p
      className={isEllipsis ? styles.ellipsis : ""}
      onClick={() => setIsEllipsis((prev) => !prev)}
    >
      {children}
    </p>
  );
};

const WriteButton = ({ title }: Pick<UnAttachedReferenceData, "title">) => {
  const { setChromeStorage } = useChromeStorage();

  const handleWriteReference = () => {
    setChromeStorage((prev) => {
      const id = prev.reference.filter(({ isWritten }) => isWritten).length + 1;
      return {
        ...prev,
        reference: prev.reference.map((data) =>
          data.title !== title
            ? data
            : { ...data, isWritten: true, id, isUsed: false }
        ),
      };
    });
  };

  return (
    <IconButton
      aria-label={`${title}에 대한 레퍼런스 사용하기`}
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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </IconButton>
  );
};

const EraseButton = ({
  title,
  id,
}: Pick<AttachedReferenceData, "title" | "id">) => {
  const { setChromeStorage } = useChromeStorage();

  const handleEraseReference = () => {
    setChromeStorage((prev) => {
      return {
        ...prev,
        reference: prev.reference.map((data) => {
          if (data.title === title) {
            const { id, isUsed, isWritten, ...rest } =
              data as AttachedReferenceData;
            return { ...rest, isWritten: false };
          }
          if (data.isWritten && data.id > id) {
            return { ...data, id: data.id - 1 };
          }
          return data;
        }),
      };
    });
  };

  return (
    <IconButton
      aria-label={`${title}에 대한 레퍼런스 사용하지 않기`}
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </IconButton>
  );
};

const RemoveButton = ({ title }: Pick<ReferenceData, "title">) => {
  const { setChromeStorage } = useChromeStorage();

  const handleRemoveReference = () => {
    setChromeStorage((prev) => {
      const removeTarget = prev.reference.find(
        (data) => data.title === title
      ) as ReferenceData;

      return {
        ...prev,
        reference: prev.reference
          .filter((data) => data.title !== title)
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
    });
  };

  return (
    <IconButton
      aria-label={`${title}에 대한 레퍼런스 기록 삭제 하기`}
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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </IconButton>
  );
};

const ClickedItem = ({ url, title }: Pick<ReferenceData, "url" | "title">) => {
  return (
    <div className={styles.clickedItem}>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
        }}
        className={styles.clickedItemButton}
      >
        링크 복사
      </button>
      <button
        onClick={() => {
          navigator.clipboard.writeText(`[${title}](${url})`);
        }}
        className={styles.clickedItemButton}
      >
        [제목](링크) 복사
      </button>
      <button
        onClick={() => {
          window.open(url, "_blank");
        }}
        className={styles.clickedItemButton}
      >
        페이지로 이동
      </button>
    </div>
  );
};

const Container = ({ children }: { children: React.ReactNode }) => (
  <section className={styles.container}>{children}</section>
);

type ReferenceItemProps = ReferenceData & {
  isActive: boolean;
  onClick: () => void;
};

export const ReferenceItem = (props: ReferenceItemProps) => {
  const { title, faviconUrl, url, isWritten, isActive, onClick } = props;
  const tab = useTab();
  const isVelogWritePage = tab?.url.includes("velog.io/write");

  if (isWritten) {
    return (
      <Container>
        <div>
          <Content onClick={onClick}>
            {faviconUrl ? (
              <Favicon faviconUrl={faviconUrl} />
            ) : (
              <DefaultFavicon />
            )}
            <div className={styles.writtenTitleContainer}>
              <Title>{title}</Title>
              <span className={styles.writtenId}>
                <span
                  className={`${styles.check}
                  ${isVelogWritePage && props.isUsed ? "" : styles.unVisible}
                  `}
                >
                  ✔
                </span>
                [{props.id}]
              </span>
            </div>
          </Content>
          <EraseButton title={title} id={props.id} />
          <RemoveButton title={title} />
        </div>
        {isActive && <ClickedItem url={url} title={title} />}
      </Container>
    );
  }
  return (
    <Container>
      <div>
        <Content onClick={onClick}>
          {faviconUrl ? (
            <Favicon faviconUrl={faviconUrl} />
          ) : (
            <DefaultFavicon />
          )}
          <Title>{title}</Title>
        </Content>
        <WriteButton title={title} />
        <RemoveButton title={title} />
      </div>
      {isActive && <ClickedItem url={url} title={title} />}
    </Container>
  );
};
