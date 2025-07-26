import { useEffect, useRef } from "react";
import CloseButton from "./CloseButton";

const MenuOverlay = ({ isOpen, onClose, children }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[1000] transition-opacity duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-full max-w-[400px] bg-white shadow-[2px_0_8px_rgba(0,0,0,0.15)] z-[1001] transition-transform duration-300 ease-in-out max-[400px]:max-w-none ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        <CloseButton onClick={onClose} />
        <div className="p-2 pt-16">{children}</div>
      </div>
    </div>
  );
};

export default MenuOverlay;
