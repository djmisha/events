import React, { useState } from "react";
import Artists from "../Artists/Artists";
import setDates from "../../utils/setDates";
import Image from "next/image";

export const EventCard = ({ event }) => {
  const { date, artistList, name, venue, link } = event;
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);
  const [isOpen, SetIsOpen] = useState(false);

  const handleClick = () => {
    SetIsOpen(!isOpen);
  };

  return (
    <div
      className={`single-event ${isOpen ? "view-full" : "view-partial"} `}
      itemScope=""
      itemType="http://schema.org/Event"
      onClick={handleClick}
    >
      <div className="event-date" itemProp="startDate" content={daySchema}>
        <div>{dayOfWeek}</div>
        <div>{dayMonth}</div>
      </div>
      <div className="event-info">
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
            View on edmtrain.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
