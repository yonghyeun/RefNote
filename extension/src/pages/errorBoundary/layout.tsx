interface ErrorPageProps {
  children: React.ReactNode;
}

const ErrorPageWrapper = ({ children }: ErrorPageProps) => (
  <section className="pt-16 pb-2 flex flex-col gap-4 items-center justify-center">
    <img src="/icon/128.png" />
    {children}
  </section>
);

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-2xl font-semibold">
    <i>{children}</i>
  </h1>
);

const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs my-1">{children}</p>
);

const Content = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-full flex flex-col items-center ${className}`}>
    {children}
  </div>
);

const Footer = ({ children }: { children: React.ReactNode }) => (
  <footer className="w-full flex flex-col justify-center items-center gap-4">
    {children}
  </footer>
);

export const ErrorPage = Object.assign(ErrorPageWrapper, {
  Title,
  Text,
  Content,
  Footer,
});
