import MenuList from "./MenuList";
import { makeVenues, makeArtists } from "../../utils/utilities";

const Sidebar = ({ events, setSearchTerm, isOpen = true }) => {
  const venues = makeVenues(events);
  const artists = makeArtists(events);

  return (
    <section className="sidebar">
      <MenuList
        image="/images/icon-venue.svg"
        text="sidebar-venues"
        navItems={venues}
        title="Venues"
        setSearchTerm={setSearchTerm}
        isOpen={isOpen}
      />
      <MenuList
        image="/images/icon-dj.svg"
        text="sidebar-artist"
        navItems={artists}
        title="DJ's and Artists"
        setSearchTerm={setSearchTerm}
        isOpen={isOpen}
      />
    </section>
  );
};

export default Sidebar;
