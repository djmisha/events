import React, { useState } from "react";
import Artists from "../Artists/Artists";
import setDates from "../../utils/setDates";
import { makeImageUrl } from "../../utils/utilities";
import Image from "next/image";

export const EventCard = ({ event }) => {
  const { date, artistList, name, venue, link, isVisible, eventSource } = event;
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`single-event ${isOpen ? "view-full" : "view-partial"} ${
        isVisible ? "visible" : "hidden"
      } `}
      itemScope=""
      itemType="http://schema.org/Event"
      onClick={handleClick}
    >
      <div
        className="artist-image"
        style={{
          backgroundImage: `url('${
            artistList[0]?.name && makeImageUrl(artistList[0].name)
          }')`,
        }}
      ></div>
      <div className="event-info">
        <div className="event-date" itemProp="startDate" content={daySchema}>
          <div>
            {dayOfWeek}, {dayMonth}
          </div>
        </div>
        <div className="event-title-artist">
          {name && (
            <span className="event-title" itemProp="name">
              {name}
            </span>
          )}
          <span className="event-artist" itemProp="name">
            <Artists data={artistList} />
          </span>
        </div>
        <div
          className="event-venue"
          itemProp="location"
          itemScope=""
          itemType="http://schema.org/Place"
        >
          <span itemProp="name">{venueName}</span>{" "}
        </div>
        <div
          className="event-location"
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
              <span>
                {address}
                <Image
                  src="/images/icon-link.svg"
                  alt="Map Icon"
                  width="15"
                  height="15"
                />
              </span>
            </a>
          )}
        </div>
        <div className="event-link">
          <a href={link} target="_blank" rel="noreferrer">
            View on {eventSource}
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
