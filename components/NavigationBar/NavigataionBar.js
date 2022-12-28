import { useState, useEffect } from "react";
import Image from "next/image";
import setDates from "../../utils/setDates";
import { removeDuplicates } from "../../utils/removeDuplicates";
import { getLocations } from "../../utils/getLocations";
// import SearchTerm from "../../utils/searchHook";

const NavItem = ({ image, text, title, navItems, handleSort, SearchTerm }) => {
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
        handleSort={handleSort}
        SearchTerm={SearchTerm}
      />
    </div>
  );
};

const MenuList = ({
  navItems,
  text,
  title,
  isOpen,
  handleSort,
  SearchTerm,
}) => {
  const [term, SetTerm] = useState();

  // useEffect(() => {
  //   if (term) SearchTerm(term);
  // }, [term]);

  const handleClick = (e) => {
    // console.log(e.target.innerText);
    // SetTerm(e.target.innerText);
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

export const NavigationBar = ({
  data,
  locationData,
  handleSort,
  SearchTerm,
}) => {
  const venues = removeDuplicates(data.map((event) => event.venue.name));
  const dates = removeDuplicates(
    data.map((event) => setDates(event.date).dayMonthYear)
  );

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
          handleSort={handleSort}
          SearchTerm={SearchTerm}
        />
        <NavItem
          image="/images/icon-dj.svg"
          text="artist"
          navItems={allArtists}
          title="DJ's and Artists"
          handleSort={handleSort}
          SearchTerm={SearchTerm}
        />
        <NavItem
          image="/images/icon-cal.svg"
          text="date"
          title="Upcoming Dates"
          handleSort={handleSort}
          SearchTerm={SearchTerm}
          navItems={dates}
        />
        {
          // add locations
        }
        <NavItem
          image="/images/icon-map.svg"
          text="city"
          title="Select Location"
          handleSort={handleSort}
          SearchTerm={SearchTerm}
          navItems={locations}
        />
      </section>
    </div>
  );
};

export default NavigationBar;
