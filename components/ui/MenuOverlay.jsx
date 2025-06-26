import { useEffect, useRef } from "react";
import CloseButton from "./CloseButton";
import classes from "./MenuOverlay.module.css";

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
      className={`${classes.overlay} ${isOpen ? classes.show : ""}`}
      aria-hidden={!isOpen}
    >
      <div
        ref={menuRef}
        className={`${classes.menu} ${isOpen ? classes.open : ""}`}
      >
        <CloseButton onClick={onClose} className={classes.closeButton} />
        <div className={classes.content}>{children}</div>
      </div>
    </div>
  );
};

export default MenuOverlay;
