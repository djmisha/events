import { useState } from "react";

const Modal = ({ content, title, isOpen, SetIsOpen }) => {
  const handleClose = () => {
    SetIsOpen(false);
  };
  return (
    <div className={`modal ${isOpen ? "modal-open" : "modal-closed"}`}>
      <div className="modal-content">
        <div className="modal-close" onClick={handleClose}>
          ✕
        </div>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
};

export default Modal;
