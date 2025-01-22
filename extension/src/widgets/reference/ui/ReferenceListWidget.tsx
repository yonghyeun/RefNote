import { memo, useState } from "react";
import { useChromeSyncStorage, useSaveErrorUrl } from "@/shared/store";
import {
  AutoConvertingToggle,
  Reference,
  ReferenceEdit,
} from "@/features/reference/ui";
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
  const [isEditUrl, setEditUrl] = useState<string>("");
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);

  const { errorUrl } = useSaveErrorUrl();

  const handleClickUrl = (url: string) => {
    setClickedUrl((prev) => (prev === url ? "" : url));
  };

  return (
    <ReferenceListContainer>
      {unAttachedReferenceList.map((reference) =>
        isEditUrl === reference.url ? (
          <ReferenceEdit
            reference={reference}
            onResolveEdit={() => {
              setEditUrl("");
              setClickedUrl("");
            }}
            className={errorUrl === reference.url ? "blink" : ""}
          />
        ) : (
          <Reference
            key={reference.url}
            onClick={() => handleClickUrl(reference.url)}
            reference={reference}
            className={errorUrl === reference.url ? "blink" : ""}
          >
            <div className="flex gap-1 items-center">
              <Reference.Favicon />
              <Reference.Title />
              <Reference.WriteButton />
              <Reference.RemoveButton />
            </div>
            {reference.url === clickedUrl && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <Reference.CopyLinkButton />
                    <Reference.CopyLinkWithTextButton />
                    <Reference.MovePageButton />
                  </div>
                  <div className="flex w-full gap-2">
                    <Reference.CustomButton
                      onClick={() => setEditUrl(reference.url)}
                    >
                      제목 수정
                    </Reference.CustomButton>
                    <Reference.CustomButton
                      onClick={() => setIsMemoOpen((prev) => !prev)}
                    >
                      {isMemoOpen ? "메모 닫기" : "메모 열기"}
                    </Reference.CustomButton>
                  </div>
                </div>
                {isMemoOpen && <Reference.MemoArea />}
              </div>
            )}
          </Reference>
        )
      )}
    </ReferenceListContainer>
  );
};

const UnAttachedReferenceListFoldButton = memo(() => {
  const isUnAttachedReferenceVisible = useChromeSyncStorage(
    (state) => state.isUnAttachedReferenceVisible
  );

  return (
    <Button
      className="py-[2px]"
      onClick={() =>
        useChromeSyncStorage.dispatchAction({
          type: "set",
          setter: ({ isUnAttachedReferenceVisible }) => ({
            isUnAttachedReferenceVisible: !isUnAttachedReferenceVisible,
          }),
        })
      }
      aria-label={
        isUnAttachedReferenceVisible
          ? "글에 첨부하지 않은 레퍼런스 리스트 목록 보기"
          : "글에 첨부하지 않은 레퍼런스 리스트 목록 숨기기"
      }
    >
      {isUnAttachedReferenceVisible ? "▲" : "▼"}
    </Button>
  );
});

const AttachedReferenceList = ({
  attachedReferenceList,
}: {
  attachedReferenceList: AttachedReferenceData[];
}) => {
  const [clickedUrl, setClickedUrl] = useState<string>("");
  const [isEditUrl, setEditUrl] = useState<string>("");
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);
  const { errorUrl } = useSaveErrorUrl();

  const handleClickUrl = (url: string) => {
    setClickedUrl((prev) => (prev === url ? "" : url));
  };

  return (
    <ReferenceListContainer>
      {attachedReferenceList.map((reference) => {
        return isEditUrl === reference.url ? (
          <ReferenceEdit
            reference={reference}
            onResolveEdit={() => {
              setEditUrl("");
              setClickedUrl("");
            }}
            className={errorUrl === reference.url ? "blink" : ""}
          />
        ) : (
          <Reference
            reference={reference}
            key={reference.url}
            onClick={() => {
              handleClickUrl(reference.url);
            }}
            className={errorUrl === reference.url ? "blink" : ""}
          >
            <div className="flex gap-1 items-center">
              <Reference.Favicon />
              <Reference.Title />
              <span className="text-[0.8rem] text-gray-400 flex gap-1">
                <span
                  className={`text-primary
              ${reference.isUsed ? "" : "hidden"}`}
                >
                  ✔
                </span>
                [{reference.id}]
              </span>
              <Reference.EraseButton />
              <Reference.RemoveButton />
            </div>
            {reference.url === clickedUrl && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <Reference.CopyLinkButton />
                    <Reference.CopyLinkWithTextButton />
                    <Reference.MovePageButton />
                  </div>
                  <div className="flex w-full gap-2">
                    <Reference.CustomButton
                      onClick={() => setEditUrl(reference.url)}
                    >
                      제목 수정
                    </Reference.CustomButton>
                    <Reference.CustomButton
                      onClick={() => setIsMemoOpen((prev) => !prev)}
                    >
                      {isMemoOpen ? "메모 닫기" : "메모 열기"}
                    </Reference.CustomButton>
                  </div>
                </div>
                {isMemoOpen && <Reference.MemoArea />}
              </div>
            )}
          </Reference>
        );
      })}
    </ReferenceListContainer>
  );
};

export const ReferenceListWidget = () => {
  const reference = useChromeSyncStorage((state) => state.reference);
  const isUnAttachedReferenceVisible = useChromeSyncStorage(
    (state) => state.isUnAttachedReferenceVisible
  );

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
          {/* memoized Component */}
          <UnAttachedReferenceListFoldButton />
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
          {/* memoized Component */}
          <AutoConvertingToggle />
        </ReferenceListWidgetHeader>
        <AttachedReferenceList attachedReferenceList={attachedReferenceList} />
      </section>
    </>
  );
};
