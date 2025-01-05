interface StackProps {
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export const Stack = ({
  children,
  className = "",
  vertical = false,
}: StackProps) => {
  return (
    <div
      className={`flex gap-4 ${
        vertical ? "flex-col" : "flex-row"
      } ${className}`}
    >
      {children}
    </div>
  );
};
