import React, { useState } from "react";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import Modal from "../Modal/Modal";
import EventDetails from "../EventDetails/EventDetails";
import styles from "./EventCard.module.scss";
import { FaRegCalendar, FaRegBuilding, FaUsers, FaVideo } from "react-icons/fa"; // Add FaUsers and FaVideo import

export const EventCard = ({ event }) => {
  const {
    date,
    artistList,
    name,
    venue,
    isVisible,
    eventSource,
    festivalInd,
    livestreamInd,
  } = event;
  const { name: venueName } = venue; // Removed address
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const truncatedArtistList =
    artistList.length > 2
      ? artistList.slice(0, 2).concat({
          name: (
            <span className={styles.truncatedArtist}>
              ... {artistList.length - 2} more artists
            </span>
          ),
        })
      : artistList;

  const ArtistImageWrapper = () => {
    const artistId = artistList[0]?.id;
    return (
      <div className={styles.artistFallback}>
        <ArtistImage id={artistId} />
      </div>
    );
  };

  return (
    <>
      <div
        className={`${styles.singleEvent} ${styles.viewFull} ${
          isVisible ? styles.visible : styles.hidden
        } ${eventSource === "ticketmaster" ? styles.ticketmasterBorder : ""}`}
        itemScope=""
        itemType="http://schema.org/Event"
        onClick={handleModalOpen}
      >
        <ArtistImageWrapper />
        <div className={styles.eventInfo}>
          <div className={styles.dateAndTitle}>
            <div className={styles.topRow}>
              <div
                className={styles.eventDate}
                itemProp="startDate"
                content={daySchema}
              >
                <FaRegCalendar className={styles.icon} />
                <div>
                  {dayOfWeek}, {dayMonth}
                </div>
              </div>
            </div>

            {name && (
              <span className={styles.eventTitle} itemProp="name">
                {name}
              </span>
            )}
            <div className={styles.eventType}>
              {festivalInd && (
                <div className={styles.festivalIndicator}>
                  <FaUsers className={styles.icon} />
                  <span>Festival</span>
                </div>
              )}

              {livestreamInd && (
                <div className={styles.liveSteamIndicator}>
                  <FaVideo className={styles.icon} />
                  <span>Stream</span>
                </div>
              )}
            </div>
          </div>

          <span className={styles.eventArtist} itemProp="name">
            <Artists data={truncatedArtistList} />
          </span>

          <div
            className={styles.eventVenue}
            itemProp="location"
            itemScope=""
            itemType="http://schema.org/Place"
          >
            <FaRegBuilding className={styles.icon} />
            <span itemProp="name">{venueName}</span>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          component={() => <EventDetails event={event} />}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default EventCard;
