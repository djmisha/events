import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import styles from "./CountBoxes.module.scss";

const CountBoxes = ({ events }) => {
  // Calculate statistics from events data
  const getStatistics = () => {
    if (!events || events.length === 0) {
      return { totalEvents: 0, totalVenues: 0, totalArtists: 0 };
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
    };
  };

  const { totalEvents, totalVenues, totalArtists } = getStatistics();

  const countItems = [
    {
      icon: FaCalendarAlt,
      count: totalEvents,
      label: totalEvents === 1 ? "Event" : "Events",
      color: "pink",
    },
    {
      icon: FaMapMarkerAlt,
      count: totalVenues,
      label: totalVenues === 1 ? "Venue" : "Venues",
      color: "blue",
    },
    {
      icon: FaUsers,
      count: totalArtists,
      label: totalArtists === 1 ? "Artist" : "Artists",
      color: "orange",
    },
  ];

  return (
    <div className={styles.countBoxes}>
      {countItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className={`${styles.countBox} ${styles[item.color]}`}
          >
            <div className={styles.iconWrapper}>
              <IconComponent className={styles.icon} />
            </div>
            <div className={styles.content}>
              <div className={styles.count}>{item.count.toLocaleString()}</div>
              <div className={styles.label}>{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountBoxes;
