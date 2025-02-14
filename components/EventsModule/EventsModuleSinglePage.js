import { useEffect, useRef, useState } from "react";
import { storeUserLocation } from "../../utils/getUserLocation";
import EventCard from "../../components/EventCard/EventCard";
import NavigationBar from "../../components/NavigationBar/NavigataionBar";
import { searchFilter } from "../../utils/searchFilter";
import { makePageHeadline } from "../../utils/utilities";
import Filter from "../../components/Filter/Filter";
import Sidebar from "../../components/NavigationBar/Sidebar";

const EventsModuleSinglePage = ({ locationData, events: eventsSSR }) => {
  let [filterVisible, setFilterVisible] = useState(false);
  const [events, setEvents] = useState(eventsSSR.data);
  const { city, state, id } = locationData;
  const title = makePageHeadline(city, state);
  const [searchTerm, setSearchTerm] = useState();
  const dataFetchedRef = useRef();
  const searchTermRef = useRef("");

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    setEvents(eventsSSR.data);
    setFilterVisible(false);
    storeUserLocation(id);
  }, [id, eventsSSR]);

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
            {events &&
              events.map((event, index) => {
                return <EventCard event={event} key={index} />;
              })}
          </div>
        </section>
        {events && <Sidebar events={events} setSearchTerm={setSearchTerm} />}
      </div>
    </>
  );
};

export default EventsModuleSinglePage;
