import { useState } from "react";
import { useChromeStorage } from "@/shared/store";
import { AutoConvertingToggle, Reference } from "@/features/reference/ui";
import { Button } from "@/shared/ui/button";
import { Heading } from "@/shared/ui/Heading";
import { Text } from "@/shared/ui/Text";

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
        <Reference key={url} onClick={() => handleClickUrl(url)}>
          <Reference.Align>
            <Reference.Favicon faviconUrl={faviconUrl} />
            <Reference.Title>{title}</Reference.Title>
            <Reference.WriteButton title={title} />
            <Reference.RemoveButton title={title} />
          </Reference.Align>
          {url === clickedUrl && (
            <Reference.Align className="gap-2">
              <Reference.CopyLinkButton url={url} />
              <Reference.CopyLinkWithTextButton url={url} title={title} />
              <Reference.MovePageButton url={url} />
            </Reference.Align>
          )}
        </Reference>
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
          <Reference
            key={url}
            onClick={() => {
              handleClickUrl(url);
            }}
          >
            <Reference.Align>
              <Reference.Favicon faviconUrl={faviconUrl} />
              <Reference.Title>{title}</Reference.Title>
              <span className="text-[0.8rem] text-gray-400 flex gap-1">
                <span
                  className={`text-primary
              ${isUsed ? "" : "hidden"}`}
                >
                  ✔
                </span>
                [{id}]
              </span>
              <Reference.EraseButton id={id} title={title} />
              <Reference.RemoveButton title={title} />
            </Reference.Align>
            {url === clickedUrl && (
              <Reference.Align className="gap-2">
                <Reference.CopyLinkButton url={url} />
                <Reference.CopyLinkWithTextButton url={url} title={title} />
                <Reference.MovePageButton url={url} />
              </Reference.Align>
            )}
          </Reference>
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
          <div className="flex gap-1 items-center">
            <Heading h2>글에 첨부되지 않은 레퍼런스</Heading>
            <Text span type="secondary">
              ({unAttachedReferenceList.length})
            </Text>
          </div>
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
          <div className="flex gap-1 items-center">
            <Heading h2>글에 첨부된 레퍼런스</Heading>
            <Text span type="secondary">
              ({attachedReferenceList.length})
            </Text>
          </div>
          <AutoConvertingToggle />
        </ReferenceListWidgetHeader>
        <AttachedReferenceList attachedReferenceList={attachedReferenceList} />
      </section>
    </>
  );
};
