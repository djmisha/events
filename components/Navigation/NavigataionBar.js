import {
  makeVenues,
  makeArtists,
  makeDates,
  makeLocations,
} from "../../utils/utilities";
import NavItem from "./NavItem";
import Hamburger from "../Hamburger/Hamburger";
import BackToTop from "../BackToTop/BackToTop";
import SearchAutoComplete from "../SearchAutoComplete/SearchAutoComplete";

const NavigationBar = ({
  events,
  setSearchTerm,
  locationData,
  setEvents,
  setFilterVisible,
  isHome,
}) => {
  const venues = makeVenues(events ?? []);
  const dates = makeDates(events ?? []);
  const artists = makeArtists(events ?? []);
  const locations = makeLocations();

  return (
    <div className="main-navigation">
      <div className="top-nav-bar">
        <div className="nav-grid">
          <Hamburger locationData={locationData} />
          <div className="nav-slot">
            {locations?.length > 0 ? (
              <NavItem
                image="/images/icon-map.svg"
                text="city"
                title="Select Location"
                setSearchTerm={setSearchTerm}
                navItems={locations}
                isLocation={true}
                isHome={isHome}
              />
            ) : (
              <div className="nav-placeholder" />
            )}
          </div>
          <div className="nav-slot">
            {venues?.length > 0 ? (
              <NavItem
                image="/images/icon-venue.svg"
                text="venue"
                navItems={venues}
                title="Venues"
                setSearchTerm={setSearchTerm}
              />
            ) : (
              <div className="nav-placeholder" />
            )}
          </div>
          <div className="nav-slot">
            {artists?.length > 0 ? (
              <NavItem
                image="/images/icon-dj.svg"
                text="artist"
                navItems={artists}
                title="DJ's and Artists"
                setSearchTerm={setSearchTerm}
              />
            ) : (
              <div className="nav-placeholder" />
            )}
          </div>
          <div className="nav-slot">
            {dates?.length > 0 ? (
              <NavItem
                image="/images/icon-cal.svg"
                text="date"
                title="Upcoming Dates"
                setSearchTerm={setSearchTerm}
                navItems={dates}
              />
            ) : (
              <div className="nav-placeholder" />
            )}
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default NavigationBar;
