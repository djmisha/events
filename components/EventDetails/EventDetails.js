import React from "react";
import PropTypes from "prop-types";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import styles from "./EventDetails.module.scss";
import { FaRegCalendar, FaRegBuilding, FaMapMarkerAlt } from "react-icons/fa"; // Add icons import
import Button from "../Button/Button";

const EventDetails = ({ event }) => {
  const { date, artistList, name, venue, link, eventSource, imageUrl } = event;
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);

  return (
    <div className={styles.eventDetails}>
      <div className={styles.artistFallback}>
        <ArtistImage id={artistList[0]?.id} imageUrl={imageUrl} />
      </div>
      <div className={styles.eventInfo}>
        <div className={styles.eventDate}>
          <FaRegCalendar className={styles.icon} />
          <div>
            {dayOfWeek}, {dayMonth}
          </div>
        </div>
        <div className={styles.eventTitleArtist}>
          {name && <span className={styles.eventTitle}>{name}</span>}
          <span className={styles.eventArtist}>
            <Artists data={artistList} />
          </span>
        </div>
        <div className={styles.eventVenue}>
          <FaRegBuilding className={styles.icon} />
          <span>{venueName}</span>{" "}
        </div>
        <div className={styles.eventLocation}>
          {address && (
            <a
              rel="noreferrer"
              href={`https://www.google.com/maps/search/${venueName} ${address}`}
              target="_blank"
            >
              <FaMapMarkerAlt className={styles.icon} />
              <span>{address}</span>
            </a>
          )}
        </div>
        <div className={styles.eventLink}>
          <Button
            href={link}
            variant="primary"
            target="_blank"
            rel="noreferrer"
          >
            View on {eventSource}
          </Button>
        </div>
      </div>
    </div>
  );
};

EventDetails.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventDetails;
