import { makeVenues, makeArtists, makeDates } from "../../utils/utilities";
import NavItem from "../Navigation/NavItem";
import BackToTop from "../BackToTop/BackToTop";
import styles from "./EventsFilter.module.scss";

const EventsFilter = ({ events, setSearchTerm }) => {
  const venues = makeVenues(events ?? []);
  const dates = makeDates(events ?? []);
  const artists = makeArtists(events ?? []);

  return (
    <div className={styles["event-filter-main-navigation"]}>
      <div className={styles["event-filter-top-nav-bar"]}>
        <div className={styles["event-filter-by"]}>Filters</div>
        <div className={styles["event-filter-nav-grid"]}>
          <div className={styles["event-filter-nav-slot"]}>
            <NavItem
              image="/images/icon-venue.svg"
              text="venue"
              navItems={venues}
              title="Venues"
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div className={styles["event-filter-nav-slot"]}>
            <NavItem
              image="/images/icon-dj.svg"
              text="artist"
              navItems={artists}
              title="DJ's and Artists"
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div className={styles["event-filter-nav-slot"]}>
            <NavItem
              image="/images/icon-cal.svg"
              text="date"
              title="Upcoming Dates"
              setSearchTerm={setSearchTerm}
              navItems={dates}
            />
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default EventsFilter;
