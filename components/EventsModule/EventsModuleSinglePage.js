import { useEffect, useRef, useState } from "react";
import { storeUserLocation } from "../../utils/getUserLocation";
import EventCard from "../../components/EventCard/EventCard";
import NavigationBar from "../../components/Navigation/NavigataionBar";
import { searchFilter } from "../../utils/searchFilter";
import { makePageHeadline } from "../../utils/utilities";
import Filter from "../../components/Filter/Filter";
import Pagination from "../../components/Pagination/Pagination";
import CountBoxes from "../../components/CountBoxes/CountBoxes";

const EventsModuleSinglePage = ({ locationData, events: eventsSSR }) => {
  let [filterVisible, setFilterVisible] = useState(false);
  const [events, setEvents] = useState(eventsSSR.data);
  const [allEvents, setAllEvents] = useState(eventsSSR.data); // Store original events
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 21;
  const { city, state, id } = locationData;
  const title = makePageHeadline(city, state);
  const [searchTerm, setSearchTerm] = useState();
  const dataFetchedRef = useRef();
  const searchTermRef = useRef("");

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    setEvents(eventsSSR.data);
    setAllEvents(eventsSSR.data); // Update stored original events
    setFilterVisible(false);
    setCurrentPage(1); // Reset to first page when location changes
    storeUserLocation(id);
  }, [id, eventsSSR]);

  useEffect(() => {
    if (searchTerm && allEvents) {
      const filteredEvents = searchFilter(searchTerm, allEvents);
      if (filteredEvents) {
        setEvents(filteredEvents);
        searchTermRef.current = searchTerm;
        setFilterVisible(true);
        setSearchTerm("");
        setCurrentPage(1); // Reset to first page when filtering
        window.location = "#top";
      }
    }
  }, [searchTerm, allEvents]);

  // Helper function to get events for current page when not filtering
  const getPaginatedEvents = () => {
    if (filterVisible) {
      // When filtering, show all filtered events (no pagination)
      return events;
    }

    // When not filtering, show paginated events
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return allEvents.slice(startIndex, endIndex);
  };

  // Get total count of visible events for pagination info
  const getVisibleEventsCount = () => {
    if (filterVisible) {
      return events.filter((event) => event.isVisible !== false).length;
    }
    return allEvents.length;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayEvents = getPaginatedEvents();

  return (
    <>
      {events && (
        <NavigationBar
          events={allEvents} // Always pass all events to navigation
          setSearchTerm={setSearchTerm}
          locationData={locationData}
          setEvents={setEvents}
          setFilterVisible={setFilterVisible}
        />
      )}
      <div className="main-wrap" id="top">
        <section className="upcoming-events">
          <h1>{title}</h1>
          <CountBoxes events={events} />
          <Filter
            events={events}
            setEvents={setEvents}
            searchTerm={searchTermRef.current}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
          />
          <div id="eventfeed">
            {displayEvents &&
              displayEvents.map((event, index) => {
                return <EventCard event={event} key={index} />;
              })}
          </div>

          {/* Show pagination only when not filtering */}
          {!filterVisible && (
            <Pagination
              currentPage={currentPage}
              totalEvents={getVisibleEventsCount()}
              eventsPerPage={eventsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default EventsModuleSinglePage;
