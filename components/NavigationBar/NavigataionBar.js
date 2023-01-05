import { useState } from "react";
import Image from "next/image";
import {
  makeVenues,
  makeArtists,
  makeDates,
  makeLocations,
} from "../../utils/utilities";
import { toSlug } from "../../utils/getLocations";
import Link from "next/link";

export const NavItem = ({
  image,
  text,
  title,
  navItems,
  setSearchTerm,
  isLocation,
}) => {
  const [isOpen, SetIsOpen] = useState(false);

  const handleClick = () => {
    SetIsOpen(!isOpen);
  };

  return (
    <div
      className={`sort-${text} ${isOpen ? "visible" : ""}`}
      onClick={handleClick}
    >
      <div className="sort-trigger" id="drop-trigger">
        <Image width={23} height={23} src={image} alt={text} />
        <span>{text}</span>
      </div>
      <MenuList
        navItems={navItems}
        text={text}
        isOpen={isOpen}
        title={title}
        setSearchTerm={setSearchTerm}
        isLocation={isLocation}
      />
    </div>
  );
};

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

export const NavigationBar = ({ events, setSearchTerm }) => {
  const venues = makeVenues(events);
  const dates = makeDates(events);
  const artists = makeArtists(events);
  let locations = makeLocations();

  return (
    <div className="navigations">
      <section className="sort">
        <NavItem
          image="/images/icon-venue.svg"
          text="venue"
          navItems={venues}
          title="Venues"
          setSearchTerm={setSearchTerm}
        />
        <NavItem
          image="/images/icon-dj.svg"
          text="artist"
          navItems={artists}
          title="DJ's and Artists"
          setSearchTerm={setSearchTerm}
        />
        <NavItem
          image="/images/icon-cal.svg"
          text="date"
          title="Upcoming Dates"
          setSearchTerm={setSearchTerm}
          navItems={dates}
        />
        <NavItem
          image="/images/icon-map.svg"
          text="city"
          title="Select Location"
          setSearchTerm={setSearchTerm}
          navItems={locations}
          isLocation={true}
        />
      </section>
    </div>
  );
};

export default NavigationBar;
