import {
  makeVenues,
  makeArtists,
  makeDates,
  makeLocations,
} from "../../utils/utilities";
import NavItem from "./NavItem";
import Hamburger from "../Hamburger/Hamburger";

const NavigationBar = ({ events, setSearchTerm }) => {
  const venues = makeVenues(events);
  const dates = makeDates(events);
  const artists = makeArtists(events);
  const locations = makeLocations();

  return (
    <div className="navigations">
      <section className="sort">
        <Hamburger />
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
