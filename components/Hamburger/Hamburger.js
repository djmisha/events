import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import { toSlug } from "../../utils/getLocations";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";

const LocationLink = ({ city, state, onClick }) => {
  const href = `/events/${toSlug(city || state)}`;
  const label = city ? `${city}, ${state}` : state;

  return (
    <Link href={href} onClick={onClick} shallow={false}>
      {label}
    </Link>
  );
};

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locationCtx } = useContext(AppContext);

  const handleClose = () => {
    setIsOpen(false);
  };

  const menuContent = (
    <>
      <div className="flex flex-col gap-4 p-4">
        <Link href="/" onClick={handleClose}>
          Home
        </Link>
        <Link href="/artists" onClick={handleClose}>
          Top Artists
        </Link>
        <Link href="/cities" onClick={handleClose}>
          Events by City
        </Link>
        <Link href="/states" onClick={handleClose}>
          Events by State
        </Link>
        <Link href="/login" onClick={handleClose}>
          Login / Sign Up
        </Link>
      </div>

      {locationCtx?.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <span className="font-semibold text-gray-700 mb-2 block">
            Recently Viewed
          </span>
          <ul className="space-y-2">
            {locationCtx?.map((location) => (
              <li key={`${location.city}-${location.state}`}>
                <LocationLink
                  city={location.city}
                  state={location.state}
                  onClick={handleClose}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 flex justify-center">
        <Image
          width={200}
          height={67}
          src="/images/logo.jpeg"
          alt="sandiegohousemusic.com"
          className="max-w-full h-auto"
        />
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-nowrap items-center justify-around relative left-0 h-15 pb-0 bg-white md:m-0">
        <MenuTrigger
          icon="/images/icon-bars-solid.svg"
          text="Menu"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        {menuContent}
      </MenuOverlay>
    </>
  );
};

export default Hamburger;
