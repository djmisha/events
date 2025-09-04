import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../features/AppContext.js";
import { getSDHMEventsClient } from "../../utils/getEvents";
import { ToSlugArtist } from "../../utils/utilities";
import EventCard from "../EventCard/EventCard";
import Button from "../Button/Button";
import { useEventModalManager } from "../../hooks/useEventModal";

const Locator = () => {
  const { currentUserLocation } = useContext(AppContext);
  const { openEventId, setOpenEventId } = useEventModalManager();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (currentUserLocation?.id && currentUserLocation?.city) {
        setLoading(true);
        try {
          const eventsData = await getSDHMEventsClient(
            currentUserLocation.id,
            currentUserLocation.city
          );
          setEvents(eventsData);
        } catch (error) {
          console.error("Error fetching events:", error);
          setEvents([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvents();
  }, [currentUserLocation]);

  if (!currentUserLocation?.id || loading) return null;
  const cityState = [currentUserLocation.city, currentUserLocation.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <h2 className="mb-4 px-4">
        Near You in <strong>{cityState}</strong>
      </h2>
      <div className="p-0 pb-6 transition-all duration-200 ease-out sm:px-3 sm:grid sm:grid-cols-2 sm:gap-4 md:mb-5 xl:grid-cols-3">
        {events?.slice(0, 9).map((event) => (
          <EventCard
            event={event}
            key={event.id}
            openEventId={openEventId}
            setOpenEventId={setOpenEventId}
          />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          href={`/events/${ToSlugArtist(
            currentUserLocation.city || currentUserLocation.state
          )}`}
          color="primary"
          size="lg"
        >
          {`View all events in ${cityState}`}
        </Button>
      </div>
    </div>
  );
};

export default Locator;
