import { useEffect, useRef, useState } from "react";
import EventCard from "../../components/EventCard/EventCard";
import NavigationBar from "../../components/Navigation/NavigataionBar";
import { searchFilter } from "../../utils/searchFilter";
import { makePageHeadline } from "../../utils/utilities";
import Filter from "../../components/Filter/Filter";

const EventsModule = ({ locationData, isHome, events: initialEvents }) => {
  let [filterVisible, setFilterVisible] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const { city, state, id } = locationData;
  const title = makePageHeadline(city, state);
  const [searchTerm, setSearchTerm] = useState();
  const dataFetchedRef = useRef();
  const searchTermRef = useRef("");

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    setFilterVisible(false);
  }, [id]);

  useEffect(() => {
    if (searchTerm && events) {
      const filteredEvents = searchFilter(searchTerm, events);
      if (filteredEvents) {
        setEvents(filteredEvents);
        searchTermRef.current = searchTerm;
        setFilterVisible(true);
        setSearchTerm("");
        window.location = "#top";
      }
    }
  }, [searchTerm, events]);

  return (
    <>
      {events && (
        <NavigationBar
          events={events}
          setSearchTerm={setSearchTerm}
          locationData={locationData}
          setEvents={setEvents}
          setFilterVisible={setFilterVisible}
          isHome={isHome}
        />
      )}
      <div className="main-wrap" id="top">
        <section className="upcoming-events">
          <h1>{title}</h1>
          <Filter
            events={events}
            setEvents={setEvents}
            searchTerm={searchTermRef.current}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
          />
          <div id="eventfeed">
            {events?.map((event) => {
              return <EventCard event={event} key={event.id} />;
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default EventsModule;
