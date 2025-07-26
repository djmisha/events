import Link from "next/link";
import { useState } from "react";
import { toSlug } from "../../utils/getLocations";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";

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
  const filteredNavItems = navItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <MenuTrigger
        icon={image}
        text={"Location"}
        onClick={() => setIsOpen(true)}
        iconAlt={text}
      />
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        <div className="p-4 h-full flex flex-col">
          <div
            id={`${text}-list`}
            className="flex flex-col gap-0 overflow-y-auto flex-1 max-h-[calc(100vh-8rem)]"
          >
            <h2 className="m-0 mb-4 text-xl font-semibold text-black font-[Nunito] flex-shrink-0">
              {title}
            </h2>
            <div className="relative w-full mb-4 flex-shrink-0">
              <input
                type="text"
                placeholder="Type to filter locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pr-10 pl-3 border border-gray-300 rounded text-base font-[Nunito] bg-white flex-shrink-0 box-border focus:outline-none focus:border-indigo-600 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.2)] placeholder:text-gray-500 placeholder:italic"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-2xl text-gray-500 cursor-pointer p-1 leading-none rounded-full w-8 h-8 flex items-center justify-center transition-[color,background-color] duration-200 ease-[ease] hover:text-gray-600 hover:bg-black/10 focus:outline-none focus:text-indigo-600 focus:bg-indigo-600/10"
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
                  className="flex justify-between items-center cursor-pointer py-2 px-0 no-underline text-black transition-colors duration-200 ease-[ease] flex-shrink-0 hover:bg-indigo-600/10"
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
