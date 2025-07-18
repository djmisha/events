import {
  makeVenues,
  makeArtists,
  makeDates,
  makePromoters,
  makeVenuesWithCounts,
  makeDatesWithCounts,
  makePromotersWithCounts,
} from "../../utils/utilities";
import NavItem from "../Navigation/NavItem";
import BackToTop from "../BackToTop/BackToTop";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaFilter,
  FaBullhorn,
} from "react-icons/fa";
import { useState } from "react";
import MenuOverlay from "../ui/MenuOverlay";
import MenuList from "../Navigation/MenuList";
import styles from "./EventsFilter.module.scss";

const EventsFilter = ({ events, setSearchTerm }) => {
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isVenueMenuOpen, setIsVenueMenuOpen] = useState(false);
  const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
  const [isPromoterMenuOpen, setIsPromoterMenuOpen] = useState(false);

  const venues = makeVenues(events ?? []);
  const dates = makeDates(events ?? []);
  const artists = makeArtists(events ?? []);
  const promoters = makePromoters(events ?? []);

  // Get items with counts for display
  const venuesWithCounts = makeVenuesWithCounts(events ?? []);
  const datesWithCounts = makeDatesWithCounts(events ?? []);
  const promotersWithCounts = makePromotersWithCounts(events ?? []);

  // Calculate statistics from events data
  const getStatistics = () => {
    if (!events || events.length === 0) {
      return {
        totalEvents: 0,
        totalVenues: 0,
        totalArtists: 0,
        totalPromoters: 0,
      };
    }

    // Get visible events (when filtering is active)
    const visibleEvents = events.filter((event) => event.isVisible !== false);

    // Count unique venues
    const uniqueVenues = new Set();
    const uniqueArtists = new Set();

    visibleEvents.forEach((event) => {
      // Count unique venues
      if (event.venue && event.venue.name) {
        uniqueVenues.add(event.venue.name);
      }

      // Count unique artists
      if (event.artistList && Array.isArray(event.artistList)) {
        event.artistList.forEach((artist) => {
          if (artist.name) {
            uniqueArtists.add(artist.name);
          }
        });
      }
    });

    return {
      totalEvents: visibleEvents.length,
      totalVenues: uniqueVenues.size,
      totalArtists: uniqueArtists.size,
      totalPromoters: promoters.length,
    };
  };

  const { totalEvents, totalVenues, totalArtists, totalPromoters } =
    getStatistics();

  return (
    <div className={styles["event-filter-main-navigation"]}>
      <div className={styles["event-filter-top-nav-bar"]}>
        <div className={styles["event-filter-by"]}>
          <FaFilter className={styles["filter-icon"]} />
          <span>Filter By</span>
        </div>
        <div className={styles["event-filter-nav-grid"]}>
          <div className={styles["event-filter-nav-slot"]}>
            <div
              className={`${styles["count-nav-item"]} ${styles.pink}`}
              onClick={() => setIsDateMenuOpen(true)}
            >
              <div className={`${styles.iconWrapper} ${styles.pink}`}>
                <FaCalendarAlt className={styles.icon} />
              </div>
              <div className={styles.content}>
                <div className={styles.count}>
                  {totalEvents.toLocaleString()}
                </div>
                <div className={styles.label}>
                  {totalEvents === 1 ? "Event" : "Events"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isDateMenuOpen}
              onClose={() => setIsDateMenuOpen(false)}
            >
              <div className={styles.menuContent}>
                <h2 className={styles.menuTitle}>Dates</h2>
                <MenuList
                  navItems={dates}
                  navItemsWithCounts={datesWithCounts}
                  text="date"
                  isOpen={isDateMenuOpen}
                  title="Dates"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsDateMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className={styles["event-filter-nav-slot"]}>
            <div
              className={`${styles["count-nav-item"]} ${styles.blue}`}
              onClick={() => setIsVenueMenuOpen(true)}
            >
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <FaMapMarkerAlt className={styles.icon} />
              </div>
              <div className={styles.content}>
                <div className={styles.count}>
                  {totalVenues.toLocaleString()}
                </div>
                <div className={styles.label}>
                  {totalVenues === 1 ? "Venue" : "Venues"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isVenueMenuOpen}
              onClose={() => setIsVenueMenuOpen(false)}
            >
              <div className={styles.menuContent}>
                <h2 className={styles.menuTitle}>Venues</h2>
                <MenuList
                  navItems={venues}
                  navItemsWithCounts={venuesWithCounts}
                  text="venue"
                  isOpen={isVenueMenuOpen}
                  title="Venues"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsVenueMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className={styles["event-filter-nav-slot"]}>
            <div
              className={`${styles["count-nav-item"]} ${styles.orange}`}
              onClick={() => setIsArtistMenuOpen(true)}
            >
              <div className={`${styles.iconWrapper} ${styles.orange}`}>
                <FaUsers className={styles.icon} />
              </div>
              <div className={styles.content}>
                <div className={styles.count}>
                  {totalArtists.toLocaleString()}
                </div>
                <div className={styles.label}>
                  {totalArtists === 1 ? "Artist" : "Artists"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isArtistMenuOpen}
              onClose={() => setIsArtistMenuOpen(false)}
            >
              <div className={styles.menuContent}>
                <h2 className={styles.menuTitle}>DJs and Artists</h2>
                <MenuList
                  navItems={artists}
                  text="artist"
                  isOpen={isArtistMenuOpen}
                  title="DJ's and Artists"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsArtistMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className={styles["event-filter-nav-slot"]}>
            <div
              className={`${styles["count-nav-item"]} ${styles.green}`}
              onClick={() => setIsPromoterMenuOpen(true)}
            >
              <div className={`${styles.iconWrapper} ${styles.green}`}>
                <FaBullhorn className={styles.icon} />
              </div>
              <div className={styles.content}>
                <div className={styles.count}>
                  {totalPromoters.toLocaleString()}
                </div>
                <div className={styles.label}>
                  {totalPromoters === 1 ? "Promoter" : "Promoters"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isPromoterMenuOpen}
              onClose={() => setIsPromoterMenuOpen(false)}
            >
              <div className={styles.menuContent}>
                <MenuList
                  navItems={promoters.map((p) => p.name || p)}
                  navItemsWithCounts={promotersWithCounts}
                  text="promoter"
                  title="Promoters"
                  isOpen={isPromoterMenuOpen}
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsPromoterMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default EventsFilter;
