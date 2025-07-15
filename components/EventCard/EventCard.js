import React from "react";
import { useRouter } from "next/router";
import Artists from "../Artists/Artists";
import ArtistImage from "../Artists/ArtistImage";
import setDates from "../../utils/setDates";
import Modal from "../Modal/Modal";
import EventDetails from "../EventDetails/EventDetails";
import EventStructuredData from "../SEO/EventStructuredData";
import { useCurrentUrl } from "../../hooks/useCurrentUrl";
import { useEventModal } from "../../hooks/useEventModal";
import styles from "./EventCard.module.scss";
import { FaRegCalendar, FaRegBuilding, FaUsers, FaVideo } from "react-icons/fa";

export const EventCard = ({ event, openEventId, setOpenEventId }) => {
  const router = useRouter();
  const currentUrl = useCurrentUrl();
  const {
    date,
    artistList,
    name,
    venue,
    isVisible,
    eventSource,
    festivalInd,
    livestreamInd,
    imageUrl,
  } = event;
  const { name: venueName } = venue;
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);

  // Use the custom hook for modal management
  const { isModalOpen, openModal, closeModal } = useEventModal(
    event.id,
    openEventId,
    setOpenEventId
  );

  const handleModalOpen = () => {
    openModal();
  };

  const handleModalClose = () => {
    closeModal();
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
        <ArtistImage id={artistId} imageUrl={imageUrl} />
      </div>
    );
  };

  return (
    <>
      <EventStructuredData
        event={event}
        currentUrl={typeof window !== "undefined" ? window.location.href : null}
      />
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
