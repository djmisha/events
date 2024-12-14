import React from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.scss";

const Modal = ({ component: Component, onClose }) => {
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
