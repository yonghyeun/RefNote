interface PageProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageProps) => (
  <section className="h-screen min-w-96 flex flex-col gap-4 mx-auto px-4 md:max-w-6xl md:px-4 ">
    {children}
  </section>
);
const Header = ({ children }: PageProps) => (
  <header className="sticky top-0">{children}</header>
);
const Content = ({ children }: PageProps) => (
  <main className="flex-grow">{children}</main>
);
const Footer = ({ children }: PageProps) => <footer>{children}</footer>;

export const Page = Object.assign(PageWrapper, { Header, Content, Footer });
