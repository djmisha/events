import React from "react";
import Artists from "../Artists/Artists";
import setDates from "../../utils/setDates";

export const EventCard = ({ event }) => {
  const { id, date, artistList, name, venue, link } = event;
  const { name: venueName, address } = venue;
  const { dayOfWeek, dayMonth, daySchema } = setDates(date);

  return (
    <div
      className="single-event"
      itemScope=""
      data-id={id}
      itemType="http://schema.org/Event"
    >
      <div className="event-date" itemProp="startDate" content={daySchema}>
        <div>{dayOfWeek}</div>
        <div>{dayMonth}</div>
      </div>
      <div className="event-info">
        <div className="event-title-artist">
          <span className="event-title" itemProp="name">
            {name}
          </span>
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
          <a
            rel="noreferrer"
            href={`https://www.google.com/maps/search/${address}`}
            target="_blank"
          >
            <span>
              {address}
              {/* <img src="assets/images/icon-link.svg" /> add this image*/}
            </span>
          </a>
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
