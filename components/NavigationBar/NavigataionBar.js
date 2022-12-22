import Image from "next/image";
import { useState } from "react";

/* Remove Duplicates Helper */
// move to diff file
export const removeDuplicates = (array) => {
  return array.filter((a, b) => array.indexOf(a) === b);
};

const NavItem = ({ image, text, title, navItems }) => {
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
      <MenuList navItems={navItems} text={text} isOpen={isOpen} title={title} />
    </div>
  );
};

const MenuList = ({ navItems, text, title, isOpen }) => {
  const handleClick = () => {
    // NEEDS HANDLE SORT Function
  };

  return (
    <div id={`${text}-list`} className={isOpen ? "visible" : ""}>
      <h2>{title}</h2>
      {navItems.map((item) => {
        return (
          <div key={item} onClick={handleClick}>
            {item}
          </div>
        );
      })}
    </div>
  );
};

export const NavigationBar = ({ data }) => {
  const venues = removeDuplicates(data.map((event) => event.venue.name));
  const dates = removeDuplicates(data.map((event) => event.date));

  let allArtists = [];
  data.map((event) => {
    return event.artistList.map((artist) => {
      allArtists.push(artist.name);
    });
  });
  allArtists = removeDuplicates(allArtists);

  return (
    <div className="navigations">
      <section className="sort">
        <NavItem
          image="/images/icon-venue.svg"
          text="venue"
          navItems={venues}
          title="Venues"
        />
        <NavItem
          image="/images/icon-dj.svg"
          text="artist"
          navItems={allArtists}
          title="DJ's and Artists"
        />
        <NavItem
          image="/images/icon-cal.svg"
          text="date"
          title="Upcoming Dates"
          navItems={dates}
        />
        {
          // add locations
        }
        <NavItem
          image="/images/icon-map.svg"
          text="city"
          title="Select Location"
          navItems={venues}
        />
      </section>
    </div>
  );
};

export default NavigationBar;
