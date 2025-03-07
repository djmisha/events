export const MenuList = ({
  navItems,
  text,
  title,
  isOpen,
  setSearchTerm,
  onClose,
}) => {
  return (
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
  );
};

export default MenuList;
