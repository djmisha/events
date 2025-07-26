import Image from "next/image";

const MenuTrigger = ({
  onClick,
  text,
  icon,
  iconAlt = "Menu",
  iconWidth = 22,
  iconHeight = 22,
  className = "",
}) => {
  return (
    <button
      className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-2 bg-transparent border-none transition-all duration-200 ease-in-out text-black visited:text-black ${className}`}
      onClick={onClick}
      aria-label={text || "Open menu"}
    >
      {icon && (
        <Image src={icon} alt={iconAlt} width={iconWidth} height={iconHeight} />
      )}
      {text && (
        <span className="text-xs font-medium uppercase tracking-wider text-black">
          {text}
        </span>
      )}
    </button>
  );
};

export default MenuTrigger;
