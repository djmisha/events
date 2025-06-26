import styles from "./MenuList.module.scss";

export const MenuList = ({
  navItems,
  navItemsWithCounts,
  text,
  title,
  isOpen,
  setSearchTerm,
  onClose,
}) => {
  // Use items with counts if available, otherwise fallback to regular items
  const itemsToRender =
    navItemsWithCounts || navItems.map((item) => ({ name: item, count: null }));

  return (
    <div id={`${text}-list`} className={isOpen ? "visible" : ""}>
      <h2>{title}</h2>
      {itemsToRender.map((item, index) => {
        const itemName = item.name || item;
        const itemCount = item.count;
        // For dates, use originalDate for filtering, display name for UI
        const searchValue = item.originalDate || itemName;

        return (
          <div
            key={index + itemName}
            onClick={(e) => {
              if (setSearchTerm) setSearchTerm(searchValue);
              onClose(e);
            }}
            className={styles.menuItem}
          >
            <div>{itemName}</div>
            {itemCount && <div className={styles.countBadge}>{itemCount}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default MenuList;
