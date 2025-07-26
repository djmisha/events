const ButtonWrapper = ({ children, className, ...props }) => {
  const wrapperClass = ["flex justify-center my-0", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} {...props}>
      {children}
    </div>
  );
};

export default ButtonWrapper;
