import { ErrorBoundary } from "@/shared/ui/errorBoundary";
import { ErrorPage } from "./layout";
import { useState } from "react";
import { Button } from "@/shared/ui/button";

const ErrorBlock = ({ error }: { error: Error }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  return (
    <div className="w-full font-mono px-2 py-4 bg-black text-red-500 overflow-auto rounded-md">
      <div
        className="
      flex justify-between items-center mb-2"
      >
        <p className="text-white">
          Error : <span>{error.message}</span>
        </p>
        <button
          onClick={() => {
            setIsCopied(true);
            navigator.clipboard.writeText(error.stack || "");
          }}
          className="border border-gray-500 px-2 py-1 rounded-md"
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className=" text-xs  overflow-scroll ">
        <pre>{error.stack}</pre>
      </div>
    </div>
  );
};

const UnExpectedErrorPage = ({ error }: { error: Error }) => (
  <ErrorPage>
    <ErrorPage.Title>Oops !</ErrorPage.Title>
    <ErrorPage.Content>
      <ErrorPage.Text>
        예기치 못한 에러가 발생했습니다. 확장 프로그램을 새로고침 하여 이전
        작업을 완료하세요
      </ErrorPage.Text>
      <ErrorPage.Text>
        깃허브 이슈란에 발생한 버그를 제보해주세요. 후두다닥 해결하겠습니다.
        (´⌒｀。)
      </ErrorPage.Text>
    </ErrorPage.Content>
    <ErrorPage.Content>
      <ErrorBlock error={error} />
    </ErrorPage.Content>
    <ErrorPage.Footer>
      <Button
        onClick={() => {
          window.location.reload();
        }}
        className="w-full"
      >
        확장 프로그램 다시 시작
      </Button>
      <Button
        className="w-full"
        onClick={() => {
          window.open("https://github.com/yonghyeun/RefNote/issues");
        }}
      >
        <div
          className="flex gap-2 
        justify-center items-center"
        >
          <img src="/icon/github.png" className="w-4 aspect-square" />
          버그 제보 하러 가기
        </div>
      </Button>
    </ErrorPage.Footer>
  </ErrorPage>
);

export const UnExpectedErrorBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ErrorBoundary
    fallback={({ error }) => <UnExpectedErrorPage error={error} />}
    shouldHandleError={() => true}
  >
    {children}
  </ErrorBoundary>
);
