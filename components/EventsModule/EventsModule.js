import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import EventCard from "../../components/EventCard/EventCard";
import NavigationBar from "../../components/Navigation/NavigataionBar";
import { searchFilter } from "../../utils/searchFilter";
import { makePageHeadline } from "../../utils/utilities";
import Filter from "../../components/Filter/Filter";
import EventsFiltered from "../../components/Filter/EventsFilter";
import Pagination from "../../components/Pagination/Pagination";
import { useEventModalManager } from "../../hooks/useEventModal";
import styles from "./EventsModule.module.scss";

const EventsModule = ({
  locationData,
  isHome,
  events: initialEvents,
  initialPage = 1,
  eventId,
}) => {
  const router = useRouter();
  const { openEventId, setOpenEventId } = useEventModalManager(); // Use the hook
  let [filterVisible, setFilterVisible] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [allEvents, setAllEvents] = useState(initialEvents); // Store original events
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lastPageBeforeFilter, setLastPageBeforeFilter] = useState(initialPage); // Remember page before filtering
  const eventsPerPage = 21;
  const { city, state, id } = locationData;
  const title = makePageHeadline(city, state);
  const [searchTerm, setSearchTerm] = useState();
  const dataFetchedRef = useRef();
  const searchTermRef = useRef("");

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    setFilterVisible(false);
    setCurrentPage(initialPage); // Use initial page from props
    setLastPageBeforeFilter(initialPage);
    setAllEvents(initialEvents); // Update stored original events
  }, [id, initialEvents, initialPage]);

  useEffect(() => {
    if (searchTerm && allEvents) {
      const filteredEvents = searchFilter(searchTerm, allEvents);
      if (filteredEvents) {
        // Store current page before filtering
        if (!filterVisible) {
          setLastPageBeforeFilter(currentPage);
        }
        setEvents(filteredEvents);
        searchTermRef.current = searchTerm;
        setFilterVisible(true);
        setSearchTerm("");
        window.location = "#top";
      }
    }
  }, [searchTerm, allEvents, currentPage, filterVisible]);

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

    // Update URL to include page number using slug instead of id
    const newUrl =
      pageNumber === 1
        ? `/events/${locationData.slug}`
        : `/events/${locationData.slug}?page=${pageNumber}`;

    // Use router.push with shallow: true to avoid full page reload
    router.push(newUrl + "#top", undefined, { shallow: true });
  };

  // Function to handle clearing filters and returning to remembered page
  const handleClearFilter = () => {
    setFilterVisible(false);
    setCurrentPage(lastPageBeforeFilter);

    // Update URL to remembered page using slug instead of id
    const newUrl =
      lastPageBeforeFilter === 1
        ? `/events/${locationData.slug}`
        : `/events/${locationData.slug}?page=${lastPageBeforeFilter}`;

    router.push(newUrl + "#top", undefined, { shallow: true });
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
          isHome={isHome}
        />
      )}
      <div className={styles.mainWrap} id="top">
        <section className={styles.upcomingEvents}>
          <h1>{title}</h1>
          <EventsFiltered
            events={events}
            setSearchTerm={setSearchTerm}
            locationData={locationData}
          />
          <Filter
            events={events}
            setEvents={setEvents}
            searchTerm={searchTermRef.current}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
            onClearFilter={handleClearFilter}
          />
          <div className={styles.eventFeed}>
            {displayEvents?.map((event) => {
              return (
                <EventCard 
                  event={event} 
                  key={event.id}
                  openEventId={openEventId}
                  setOpenEventId={setOpenEventId}
                />
              );
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

export default EventsModule;
