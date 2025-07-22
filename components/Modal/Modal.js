import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.scss";

const Modal = ({ component: Component, onClose }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Add styles to prevent scrolling
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, []);
  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles["modal-close"]} onClick={onClose}>
          &times;
        </button>
        <div className={styles["modal-body"]}>
          <Component />
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  component: PropTypes.elementType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
