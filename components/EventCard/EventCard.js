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
            <span className="text-gray-500 text-sm font-normal inline">
              ... {artistList.length - 2} more artists
            </span>
          ),
        })
      : artistList;

  const ArtistImageWrapper = () => {
    const artistId = artistList[0]?.id;
    return (
      <div
        className="bg-white w-28 h-28 bg-no-repeat bg-cover rounded-md mr-5"
        style={{
          backgroundImage:
            "url('https://www.sandiegohousemusic.com/images/housemusic192.png')",
        }}
      >
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
        className={`relative transition-all duration-100 ease-out text-left py-5 px-4 mx-3 mb-6 md:m-0 md:p-5 bg-white top-0 flex overflow-hidden border border-gray-200 cursor-pointer shadow-md transform-none rounded-lg h-auto ${
          !isVisible ? "hidden" : ""
        } ${
          eventSource === "ticketmaster" ? "border-2 border-pink-500" : ""
        } md:hover:-translate-y-0.5 md:hover:scale-[1.005] md:hover:shadow-lg`}
        itemScope=""
        itemType="http://schema.org/Event"
        onClick={handleModalOpen}
      >
        <ArtistImageWrapper />
        <div className="w-[calc(100%-140px)] flex flex-col justify-between gap-2.5 h-auto">
          <div>
            <div className="flex justify-between items-center w-full">
              <div
                className="text-sm leading-7 font-medium flex items-center gap-2 m-0 p-0"
                style={{ color: "#1c94a5" }}
                itemProp="startDate"
                content={daySchema}
              >
                <FaRegCalendar className="text-current" />
                <div>
                  {dayOfWeek}, {dayMonth}
                </div>
              </div>
            </div>

            {name && (
              <span
                className="text-black block whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%] mt-1"
                itemProp="name"
              >
                {name}
              </span>
            )}
            <div className="flex">
              {festivalInd && (
                <div className="flex items-center gap-1 text-orange-500 text-xs font-medium mr-2.5">
                  <FaUsers className="text-current text-xs" />
                  <span>Festival</span>
                </div>
              )}

              {livestreamInd && (
                <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                  <FaVideo className="text-current text-xs" />
                  <span>Stream</span>
                </div>
              )}
            </div>
          </div>

          <div
            className="break-anywhere font-semibold text-xl leading-6 text-left relative pb-2.5 m-0 p-0 md:pb-2.5"
            itemProp="name"
          >
            <Artists data={truncatedArtistList} />
          </div>

          <div
            className="flex items-center gap-2 text-sm leading-4 text-black m-0 p-0 font-medium"
            itemProp="location"
            itemScope=""
            itemType="http://schema.org/Place"
          >
            <FaRegBuilding className="text-current" />
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
