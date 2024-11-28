import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};

export const IconButton = ({ children, ...props }: ButtonProps) => {
  return (
    <button className={styles.iconButton} {...props}>
      {children}
    </button>
  );
};
