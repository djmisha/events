import Link from "next/link";
import { useState } from "react";
import { toSlug } from "../../utils/getLocations";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";
import styles from "./LocationSelect.module.scss";

const LocationSelect = ({ image, text, title, navItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const homeSlug = (slug) => {
    return `/events/${slug}`;
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm(""); // Clear search when menu closes
  };

  // Filter nav items based on search term
  const filteredNavItems = navItems.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div id={`${text}-list`} className={styles.locationList}>
            <h2 className={styles.menuTitle}>{title}</h2>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Type to filter locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            {filteredNavItems.map((item, index) => {
              const slug = homeSlug(toSlug(item));
              return (
                <Link
                  href={slug}
                  key={index + item}
                  className={styles.locationLink}
                  onClick={handleClose}
                >
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
