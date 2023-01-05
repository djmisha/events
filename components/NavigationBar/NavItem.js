import { useState } from "react";
import Image from "next/image";
import MenuList from "./ManuList";

const NavItem = ({
  image,
  text,
  title,
  navItems,
  setSearchTerm,
  isLocation,
}) => {
  const [isOpen, SetIsOpen] = useState(false);

  const handleClick = () => {
    SetIsOpen(!isOpen);
  };

  return (
    <div
      className={`sort-${text} ${isOpen ? "visible" : ""}`}
      onClick={handleClick}
    >
      <div className="sort-trigger" id="drop-trigger">
        <Image width={23} height={23} src={image} alt={text} />
        <span>{text}</span>
      </div>
      <MenuList
        navItems={navItems}
        text={text}
        isOpen={isOpen}
        title={title}
        setSearchTerm={setSearchTerm}
        isLocation={isLocation}
      />
    </div>
  );
};

export default NavItem;
