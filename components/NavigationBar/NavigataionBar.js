import { useState } from "react";
import Image from "next/image";
import { removeDuplicates } from "../../utils/removeDuplicates";
import { getLocations } from "../../utils/getLocations";

const NavItem = ({ image, text, title, navItems, SearchTerm, isLocation }) => {
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
        SearchTerm={SearchTerm}
        isLocation={isLocation}
      />
    </div>
  );
};

const MenuList = ({ navItems, text, title, isOpen, SearchTerm }) => {
  const handleClick = (e) => {
    SearchTerm(e.target.innerText);
  };

  return (
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
  );
};

export const NavigationBar = ({ data, locationData, SearchTerm }) => {
  const venues = removeDuplicates(data.map((event) => event.venue.name));
  const dates = removeDuplicates(data.map((event) => event.formattedDate));

  let locations = getLocations();
  locations = locations.map((loc) => {
    return loc.city || loc.state;
  });

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
          SearchTerm={SearchTerm}
        />
        <NavItem
          image="/images/icon-dj.svg"
          text="artist"
          navItems={allArtists}
          title="DJ's and Artists"
          SearchTerm={SearchTerm}
        />
        <NavItem
          image="/images/icon-cal.svg"
          text="date"
          title="Upcoming Dates"
          SearchTerm={SearchTerm}
          navItems={dates}
        />
        {/* <NavItem
          image="/images/icon-map.svg"
          text="city"
          title="Select Location"
          SearchTerm={SearchTerm}
          navItems={locations}
          isLocation={true}
        /> */}
      </section>
    </div>
  );
};

export default NavigationBar;
