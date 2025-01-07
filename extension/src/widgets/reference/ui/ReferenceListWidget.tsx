import { useState } from "react";
import { useChromeStorage } from "@/shared/store";
import { AutoConvertingToggle, ReferenceItem } from "@/features/reference/ui";
import { Button } from "@/shared/ui/button";

const ReferenceListWidgetTitle = ({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) => (
  <h2 className="text-base">
    {children}
    <span className="text-[0.8rem] text-[#a0a0a0] ml-1">({count})</span>
  </h2>
);

const ReferenceListContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ul className="flex-grow overflow-y-auto rounded-md">{children}</ul>;
};

const ReferenceListWidgetHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex justify-between items-end gap-4">{children}</div>;
};

const UnAttachedReferenceList = ({
  unAttachedReferenceList,
}: {
  unAttachedReferenceList: UnAttachedReferenceData[];
}) => {
  const [clickedUrl, setClickedUrl] = useState<string>("");

  const handleClickUrl = (url: string) => {
    setClickedUrl((prev) => (prev === url ? "" : url));
  };

  return (
    <ReferenceListContainer>
      {unAttachedReferenceList.map(({ url, title, faviconUrl }) => (
        <ReferenceItem key={url} onClick={() => handleClickUrl(url)}>
          <ReferenceItem.Align>
            <ReferenceItem.Favicon faviconUrl={faviconUrl} />
            <ReferenceItem.Title>{title}</ReferenceItem.Title>
            <ReferenceItem.WriteButton title={title} />
            <ReferenceItem.RemoveButton title={title} />
          </ReferenceItem.Align>
          {url === clickedUrl && (
            <ReferenceItem.Align className="gap-2">
              <ReferenceItem.CopyLinkButton url={url} />
              <ReferenceItem.CopyLinkWithTextButton url={url} title={title} />
              <ReferenceItem.MovePageButton url={url} />
            </ReferenceItem.Align>
          )}
        </ReferenceItem>
      ))}
    </ReferenceListContainer>
  );
};

const AttachedReferenceList = ({
  attachedReferenceList,
}: {
  attachedReferenceList: AttachedReferenceData[];
}) => {
  const [clickedUrl, setClickedUrl] = useState<string>("");

  const handleClickUrl = (url: string) => {
    setClickedUrl((prev) => (prev === url ? "" : url));
  };

  return (
    <ReferenceListContainer>
      {attachedReferenceList.map(({ url, title, faviconUrl, isUsed, id }) => {
        return (
          <ReferenceItem
            key={url}
            onClick={() => {
              handleClickUrl(url);
            }}
          >
            <ReferenceItem.Align>
              <ReferenceItem.Favicon faviconUrl={faviconUrl} />
              <ReferenceItem.Title>{title}</ReferenceItem.Title>
              <span className="text-[0.8rem] text-gray-400 flex gap-1">
                <span
                  className={`text-primary
              ${isUsed ? "" : "hidden"}`}
                >
                  ✔
                </span>
                [{id}]
              </span>
              <ReferenceItem.EraseButton id={id} title={title} />
              <ReferenceItem.RemoveButton title={title} />
            </ReferenceItem.Align>
            {url === clickedUrl && (
              <ReferenceItem.Align className="gap-2">
                <ReferenceItem.CopyLinkButton url={url} />
                <ReferenceItem.CopyLinkWithTextButton url={url} title={title} />
                <ReferenceItem.MovePageButton url={url} />
              </ReferenceItem.Align>
            )}
          </ReferenceItem>
        );
      })}
    </ReferenceListContainer>
  );
};

export const ReferenceListWidget = () => {
  const {
    chromeStorage: { reference },
  } = useChromeStorage();
  const [isUnAttachedReferenceVisible, setIsUnAttachedReferenceVisible] =
    useState<boolean>(true);

  const attachedReferenceList = reference
    .filter((data): data is AttachedReferenceData => data.isWritten)
    .sort((prev, cur) => prev.id - cur.id);

  const unAttachedReferenceList = reference.filter(
    (data): data is UnAttachedReferenceData => !data.isWritten
  );

  return (
    <>
      <section
        className={`flex flex-col gap-2 transition-[height,margin] duration-300 ${isUnAttachedReferenceVisible ? "h-1/2" : "h-0 mb-10"}`}
      >
        <ReferenceListWidgetHeader>
          <ReferenceListWidgetTitle count={unAttachedReferenceList.length}>
            글에 첨부되지 않은 레퍼런스
          </ReferenceListWidgetTitle>
          <Button
            className="py-[2px]"
            onClick={() => setIsUnAttachedReferenceVisible((prev) => !prev)}
            aria-label={
              isUnAttachedReferenceVisible
                ? "글에 첨부하지 않은 레퍼런스 리스트 목록 보기"
                : "글에 첨부하지 않은 레퍼런스 리스트 목록 숨기기"
            }
          >
            {isUnAttachedReferenceVisible ? "▲" : "▼"}
          </Button>
        </ReferenceListWidgetHeader>
        <UnAttachedReferenceList
          unAttachedReferenceList={unAttachedReferenceList}
        />
      </section>
      <section
        className={`h-1/2 flex flex-col gap-2 ${
          isUnAttachedReferenceVisible ? "" : "flex-grow"
        }`}
      >
        <ReferenceListWidgetHeader>
          <ReferenceListWidgetTitle count={attachedReferenceList.length}>
            글에 첨부된 레퍼런스
          </ReferenceListWidgetTitle>
          <AutoConvertingToggle />
        </ReferenceListWidgetHeader>
        <AttachedReferenceList attachedReferenceList={attachedReferenceList} />
      </section>
    </>
  );
};
