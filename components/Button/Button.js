const Button = ({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  ...props
}) => {
  const baseClasses =
    "inline-block px-6 py-3 text-base font-medium text-center no-underline rounded-full transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-0.5 hover:shadow-lg";

  const variantClasses = {
    primary: "bg-pink text-white border-none hover:bg-pink/90",
    secondary: "bg-transparent text-blue border-2 border-blue hover:bg-blue/10",
  };

  const buttonClass = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
