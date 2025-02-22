import Image from "next/image";
import styles from "./MenuTrigger.module.css";

const MenuTrigger = ({
  onClick,
  text,
  icon,
  iconAlt = "Menu",
  iconWidth = 25,
  iconHeight = 25,
  className = "",
}) => {
  return (
    <button
      className={`${styles.trigger} ${className}`}
      onClick={onClick}
      aria-label={text || "Open menu"}
    >
      {icon && (
        <Image src={icon} alt={iconAlt} width={iconWidth} height={iconHeight} />
      )}
      {text && <span>{text}</span>}
    </button>
  );
};

export default MenuTrigger;
