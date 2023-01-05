import { MenuList, NavItem } from "./NavigataionBar";
import { removeDuplicates } from "../../utils/utilities";

const Sidebar = ({ events, setSearchTerm, isOpen = true }) => {
  // abstract this func
  const venues = removeDuplicates(events.map((event) => event.venue.name));
  // abstract this func
  let allArtists = [];
  events.map((event) => {
    return event.artistList.map((artist) => {
      allArtists.push(artist.name);
    });
  });
  allArtists = removeDuplicates(allArtists);

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
        navItems={allArtists}
        title="DJ's and Artists"
        setSearchTerm={setSearchTerm}
        isOpen={isOpen}
      />
    </section>
  );
};

export default Sidebar;
