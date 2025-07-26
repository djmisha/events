import { useState } from "react";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <MenuTrigger
        icon={image}
        text={text}
        onClick={() => setIsOpen(true)}
        iconAlt={text}
      />
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        <div className="px-4">
          <h2 className="text-2xl mb-8 text-center pt-4">{title}</h2>
          <MenuList
            navItems={navItems}
            text={text}
            isOpen={isOpen}
            title={title}
            setSearchTerm={setSearchTerm}
            isLocation={isLocation}
            isHome={isHome}
            onClose={handleClose}
          />
        </div>
      </MenuOverlay>
    </div>
  );
};

export default NavItem;
