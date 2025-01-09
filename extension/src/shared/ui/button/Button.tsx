type ButtonSize = "sm" | "md";
type ButtonType = "primary" | "danger";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ButtonSize;
  color?: ButtonType;
}

const getSize = (size: ButtonSize) => {
  const sizeMap: Record<ButtonSize, string> = {
    sm: "text-xs py-[4px] px-[0.5rem]",
    md: "text-sm px-4 py-2",
  };

  return sizeMap[size];
};

const getStyle = (color: ButtonType) => {
  const styleMap: Record<ButtonType, string> = {
    primary: `bg-primary text-text border-none text-center no-underline inline-block cursor-pointer
        hover:bg-primary-dark hover:text-text-hover
        focus-visible:bg-primary-dark focus-visible:text-text-hover
        active:bg-primary-darker active:text-text-hover
        disabled:pointer-events-none disabled:bg-primary-disabled disabled:text-text-disabled`,

    danger: `bg-danger text-text border-none text-center no-underline inline-block cursor-pointer
        hover:bg-danger-hover hover:text-text-hover
        focus-visible:bg-danger-hover focus-visible:text-text-hover
        active:bg-danger-active active:text-text-hover
        disabled:pointer-events-none disabled:bg-danger-disabled disabled:text-text-disabled`,
  };

  return styleMap[color];
};

export const Button = ({
  children,
  className = "",
  size = "md",
  color = "primary",
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`rounded-md font-medium ${getSize(size)} ${getStyle(color)} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </button>
  );
};

export const IconButton = ({
  children,
  className = "",
  onClick,
  ...props
}: Omit<ButtonProps, "type">) => {
  return (
    <button
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
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
