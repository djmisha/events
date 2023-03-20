import Image from "next/image";

const Modal = ({ content, title, isOpen, SetIsOpen }) => {
  const handleClose = () => {
    SetIsOpen(false);
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : "modal-closed"}`}>
      <div className="modal-content">
        <div className="modal-close" onClick={handleClose}>
          <Image
            width={25}
            height={25}
            src="/images/icon-back.svg"
            alt="Menu"
          />
          <span>Back</span>
        </div>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
};

export default Modal;
