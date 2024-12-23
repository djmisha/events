import React from "react";
import PropTypes from "prop-types";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import styles from "./EventDetails.module.scss";

const EventDetails = ({ event }) => {
  const { date, artistList, name, venue, link, eventSource } = event;
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);

  return (
    <div className={styles.eventDetails}>
      <div className={styles.artistFallback}>
        <ArtistImage id={artistList[0]?.id} />
      </div>
      <div className={styles.eventInfo}>
        <div
          className={styles.eventDate}
          itemProp="startDate"
          content={daySchema}
        >
          <div>
            {dayOfWeek}, {dayMonth}
          </div>
        </div>
        <div className={styles.eventTitleArtist}>
          {name && (
            <span className={styles.eventTitle} itemProp="name">
              {name}
            </span>
          )}
          <span className={styles.eventArtist} itemProp="name">
            <Artists data={artistList} />
          </span>
        </div>
        <div
          className={styles.eventVenue}
          itemProp="location"
          itemScope=""
          itemType="http://schema.org/Place"
        >
          <span itemProp="name">{venueName}</span>{" "}
        </div>
        <div
          className={styles.eventLocation}
          itemScope=""
          itemType="http://schema.org/PostalAddress"
          itemProp="address"
          content={address}
        >
          {address && (
            <a
              rel="noreferrer"
              href={`https://www.google.com/maps/search/${venueName}${address}`}
              target="_blank"
            >
              <span>{address}</span>
            </a>
          )}
        </div>
        <div className={styles.eventLink}>
          <a href={link} target="_blank" rel="noreferrer">
            View on {eventSource}
          </a>
        </div>
      </div>
    </div>
  );
};

EventDetails.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventDetails;
