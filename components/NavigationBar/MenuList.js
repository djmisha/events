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
}) => {
  const handleClick = (e) => {
    setSearchTerm(e.target.innerText);
  };

  const homeSlug = (slug) => {
    if (isHome) {
      return `/events/${slug}`;
    }
    return slug;
  };
  // @TODO - refactor dry
  return (
    <>
      {!isLocation && (
        <div id={`${text}-list`} className={isOpen ? "visible" : ""}>
          <h2>{title}</h2>
          {navItems.map((item, index) => {
            return (
              <div key={index + item} onClick={(e) => handleClick(e)}>
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
