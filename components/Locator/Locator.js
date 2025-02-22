import { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../../features/AppContext.js";
import { locationUrl } from "../../utils/getLocations";
import { cityOrState } from "../../utils/utilities";
import { getEventsHome } from "../../utils/getEvents";
import { getGeoLocation } from "../../services/locationService";
import EventCard from "../EventCard/EventCard";

const Locator = ({ locations }) => {
  const { locationCtx, addLocation } = useContext(AppContext);
  const [events, setEvents] = useState();
  const [loading, setLoading] = useState(true);
  const eventsFetchedRef = useRef(false);
  const [userLocation, setUserLocation] = useState();
  const [hasCity, setHasCity] = useState(false);

  useEffect(() => {
    getGeoLocation(locations, setUserLocation, addLocation, setHasCity);
  }, [locations, addLocation]);

  useEffect(() => {
    if (userLocation?.id && !eventsFetchedRef.current) {
      eventsFetchedRef.current = true;
      getEventsHome(userLocation.id, setEvents, setLoading);
    }
  }, [userLocation]);

  return (
    <>
      {userLocation && events && (
        <div className="home-your-location">
          <h2>
            Near You in{" "}
            <strong>
              {cityOrState(userLocation.city, userLocation.state)}
            </strong>
          </h2>
          <div id="artistfeed">
            {events?.slice(0, 9).map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
          <button>
            <a
              href={`events/${locationUrl(userLocation, hasCity)}`}
              className="secondary"
            >
              All events in {cityOrState(userLocation.city, userLocation.state)}
            </a>
          </button>
        </div>
      )}

      {!userLocation && (
        <div className="home-your-location">
          <p>Scroll down for locations</p>
          <p>
            <strong>&darr;</strong>
          </p>
        </div>
      )}
    </>
  );
};

export default Locator;
