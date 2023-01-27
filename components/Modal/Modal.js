import { useState } from "react";

const Modal = ({ content, isOpen }) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  const handleClick = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <div className={`modal ${modalOpen ? "modal-open" : "modal-closed"}`}>
      <div className="modal-close" onClick={handleClick}>
        X
      </div>
      {content}
    </div>
  );
};

export default Modal;
