import Link from "next/link";
import { useState } from "react";
import { toSlug } from "../../utils/getLocations";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";
import styles from "./LocationSelect.module.css";

const LocationSelect = ({ image, text, title, navItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const homeSlug = (slug) => {
    return `/events/${slug}`;
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.navItem}>
      <MenuTrigger
        icon={image}
        text={"Location"}
        onClick={() => setIsOpen(true)}
        iconAlt={text}
      />
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        <div className={styles.menuContent}>
          <h2 className={styles.menuTitle}>{title}</h2>
          <div id={`${text}-list`} className={isOpen ? "visible" : ""}>
            <h2>{title}</h2>
            {navItems.map((item, index) => {
              const slug = homeSlug(toSlug(item));
              return (
                <Link href={slug} key={index + item}>
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      </MenuOverlay>
    </div>
  );
};

export default LocationSelect;
