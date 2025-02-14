import { useState } from "react";
import Image from "next/image";
import MenuList from "./MenuList";

const NavItem = ({
  image,
  text,
  title,
  navItems,
  setSearchTerm,
  isLocation,
  isHome,
}) => {
  const [isOpen, SetIsOpen] = useState(false);

  const handleOpen = (e) => {
    SetIsOpen(true);
  };

  const handleClose = (e) => {
    SetIsOpen(false);
  };

  return (
    <div className={`sort-${text} ${isOpen ? "visible" : ""}`}>
      <div className="sort-trigger" id="drop-trigger" onClick={handleOpen}>
        <Image width={23} height={23} src={image} alt={text} />
        <span>{text}</span>
      </div>
      <div id={`${text}-list`} className={isOpen ? "visible" : ""}>
        {isOpen && (
          <button className="nav-close-button" onClick={handleClose}>
            <Image
              width={25}
              height={25}
              src="/images/icon-close.svg"
              alt="Close"
            />
            <span>CLOSE</span>
          </button>
        )}
        <h2>{title}</h2>
        <MenuList
          navItems={navItems}
          text={text}
          isOpen={isOpen}
          title={title}
          setSearchTerm={setSearchTerm}
          isLocation={isLocation}
          isHome={isHome}
          onClose={handleClose} // Add this line
        />
      </div>
    </div>
  );
};

export default NavItem;
