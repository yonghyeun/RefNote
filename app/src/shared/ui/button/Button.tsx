import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button className={`${styles.button} ${className}`} {...props}>
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
    <button className={`${styles.iconButton} ${className}`} {...props}>
      {children}
    </button>
  );
};
