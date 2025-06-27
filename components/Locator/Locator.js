import { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../../features/AppContext.js";
import { locationUrl } from "../../utils/getLocations";
import { cityOrState } from "../../utils/utilities";
import { getEventsHome } from "../../utils/getEvents";
import { getGeoLocation } from "../../features/services/locationService.js";
import EventCard from "../EventCard/EventCard";
import Button from "../Button/Button";
import { useEventModalManager } from "../../hooks/useEventModal";
import buttonStyles from "../Button/Button.module.scss";
import styles from "./Locator.module.scss";
import feedStyles from "./LocatorFeed.module.scss";

const Locator = ({ locations }) => {
  const { locationCtx, addLocation } = useContext(AppContext);
  const { openEventId, setOpenEventId } = useEventModalManager(); // Use the hook
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
      {userLocation && (
        <div className="home-your-location">
          <div
            className={styles.locationCard}
            onClick={() =>
              (window.location.href = `events/${locationUrl(
                userLocation,
                hasCity
              )}`)
            }
          >
            <p className={styles.locationText}>
              We think you&apos;re in{" "}
              <strong>
                {cityOrState(userLocation.city, userLocation.state)}
              </strong>
            </p>
            <span className={styles.viewEventsLink}>
              View events in{" "}
              {cityOrState(userLocation.city, userLocation.state)} →
            </span>
          </div>

          {events && (
            <>
              <h2>
                Near You in{" "}
                <strong>
                  {cityOrState(userLocation.city, userLocation.state)}
                </strong>
              </h2>
              <div className={feedStyles.artistFeed}>
                {events?.slice(0, 9).map((event) => (
                  <EventCard 
                    event={event} 
                    key={event.id}
                    openEventId={openEventId}
                    setOpenEventId={setOpenEventId}
                  />
                ))}
              </div>
              <div className={buttonStyles.buttonWrapper}>
                <Button
                  href={`events/${locationUrl(userLocation, hasCity)}`}
                  variant="secondary"
                >
                  All events in{" "}
                  {cityOrState(userLocation.city, userLocation.state)}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Locator;
