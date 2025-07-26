const CloseButton = ({ onClick, className }) => {
  return (
    <button
      className={`absolute right-4 top-4 bg-transparent border-none text-2xl cursor-pointer p-2 leading-none z-[99999] hover:opacity-70 transition-opacity duration-200 ${
        className || ""
      }`}
      onClick={onClick}
      aria-label="Close"
    >
      ×
    </button>
  );
};

export default CloseButton;
