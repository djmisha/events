import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  ...props
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${className || ""}`;

  if (href) {
    return (
      <a href={href} className={buttonClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
