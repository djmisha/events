import Link from "next/link";
import { toSlug } from "../../utils/getLocations";

export const MenuList = ({
  navItems,
  text,
  title,
  isOpen,
  setSearchTerm,
  isLocation,
}) => {
  const handleClick = (e) => {
    setSearchTerm(e.target.innerText);
  };

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
            const slug = toSlug(item);
            return (
              <div key={index + item}>
                <Link href={slug}>{item}</Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MenuList;
