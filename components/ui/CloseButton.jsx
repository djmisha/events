import classes from "./CloseButton.module.css";

const CloseButton = ({ onClick, className }) => {
  return (
    <button
      className={`${classes.closeButton} ${className || ""}`}
      onClick={onClick}
      aria-label="Close"
    >
      ×
    </button>
  );
};

export default CloseButton;
