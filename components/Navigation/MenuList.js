import Link from "next/link";
import { toSlug } from "../../utils/getLocations";

export const MenuList = ({
  navItems,
  text,
  title,
  isOpen,
  setSearchTerm,
  isLocation,
  isHome,
  onClose,
}) => {
  const handleClick = (e) => {
    setSearchTerm(e.target.innerText);
  };

  const homeSlug = (slug) => {
    return `/events/${slug}`;
  };
  // @TODO - refactor dry
  return (
    <>
      {!isLocation && (
        <div id={`${text}-list`} className={isOpen ? "visible" : ""}>
          <h2>{title}</h2>
          {navItems.map((item, index) => {
            return (
              <div
                key={index + item}
                onClick={(e) => {
                  if (setSearchTerm) setSearchTerm(item);
                  onClose(e);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
      {isLocation && (
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
      )}
    </>
  );
};

export default MenuList;
