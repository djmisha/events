import { useEffect, useRef, useState } from "react";
import { storeUserLocation } from "../../utils/getUserLocation";
import EventCard from "../../components/EventCard/EventCard";
import getEvents from "../../utils/getEvents";
import Spinner from "../../components/Spinner/Spinner";
import NavigationBar from "../../components/NavigationBar/NavigataionBar";
import { searchFilter } from "../../utils/searchFilter";
import { makePageTitle } from "../../utils/utilities";
import Filter from "../../components/Filter/Filter";
import Sidebar from "../../components/NavigationBar/Sidebar";

const EventsModule = ({ locationData }) => {
  let [filterVisible, setFilterVisible] = useState(false);
  const [events, setEvents] = useState();
  const { city, state, id } = locationData;
  const title = makePageTitle(city, state);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState();
  const dataFetchedRef = useRef();
  const searchTermRef = useRef("");

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    getEvents(id, setEvents, setLoading);
    setFilterVisible(false);
    storeUserLocation(id);
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
        {loading && <Spinner isLoading={loading} />}
        <div id="eventfeed">
          {events &&
            events.map((event, index) => {
              return <EventCard event={event} key={index} />;
            })}
        </div>
      </section>
      {events && <Sidebar events={events} setSearchTerm={setSearchTerm} />}
      {events && (
        <NavigationBar events={events} setSearchTerm={setSearchTerm} />
      )}
    </div>
  );
};

export default EventsModule;
