import React, { useState } from "react";
import Artists from "../Artists/Artists";
import setDates from "../../utils/setDates";
import { makeImageUrl } from "../../utils/utilities";
import Image from "next/image";
import Modal from "../Modal/Modal";
import EventDetails from "../EventDetails/EventDetails";
import styles from "./EventCard.module.scss";

export const EventCard = ({ event }) => {
  const {
    date,
    artistList,
    name,
    venue,
    link,
    isVisible,
    eventSource,
    imageUrl,
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
    artistList.length > 3
      ? artistList.slice(0, 3).concat({
          name: (
            <span className={styles.truncatedArtist}>
              ... {artistList.length - 3} more artists
            </span>
          ),
        })
      : artistList;

  const ArtistImage = () => {
    const url =
      imageUrl ||
      (artistList[0]?.name
        ? makeImageUrl(artistList[0].name)
        : makeImageUrl("no-image"));
    return (
      <div className={styles.artistFallback}>
        <div
          className={styles.artistImage}
          style={{
            backgroundImage: `url('${url}')`,
          }}
        ></div>
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
        <ArtistImage />
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
              <Artists data={truncatedArtistList} />
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
          <div className={styles.eventLink}>
            <a onClick={handleModalOpen}>View Details</a>
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
