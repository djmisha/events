import { useState } from "react";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";
import MenuList from "./MenuList";
import styles from "./NavItem.module.css";

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
    <div className={styles.navItem}>
      <MenuTrigger
        icon={image}
        text={text}
        onClick={() => setIsOpen(true)}
        iconAlt={text}
      />
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        <div className={styles.menuContent}>
          <h2 className={styles.menuTitle}>{title}</h2>
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
