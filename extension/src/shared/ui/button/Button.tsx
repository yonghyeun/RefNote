interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`bg-primary text-text text-sm border-none rounded-md font-medium px-4 py-2 text-center no-underline inline-block cursor-pointer
        hover:bg-primary-dark hover:text-text-hover
        focus-visible:bg-primary-dark focus-visible:text-text-hover
        active:bg-primary-darker active:text-text-hover
        disabled:pointer-events-none disabled:bg-primary-disabled disabled:text-text-disabled
        ${className}`}
    >
      {children}
    </button>
  );
};

export const IconButton = ({
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`p-2 flex items-center border-none bg-iconButton rounded-md cursor-pointer
        hover:bg-iconButton-hover
        focus-visible:bg-iconButton-hover
        active:bg-iconButton-active
        ${className}`}
    >
      {children}
    </button>
  );
};
