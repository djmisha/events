import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import EventCard from "../../components/EventCard/EventCard";
import getEvents from "../../utils/getEvents";
import Spinner from "../../components/Spinner/Spinner";
import NavigationBar from "../../components/NavigationBar/NavigataionBar";
import { searchFilter } from "../../utils/searchFilter";
import { makePageTitle } from "../../utils/utilities";
import Filter from "../../components/Filter/Filter";
import Sidebar from "../../components/NavigationBar/Sidebar";

export default function Location({ locationData }) {
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
  }, [id]);

  useEffect(() => {
    if (searchTerm && events) {
      const filteredEvents = searchFilter(searchTerm, events);
      if (filteredEvents) {
        setEvents(filteredEvents);
        searchTermRef.current = searchTerm;
        setFilterVisible(true);
        setSearchTerm("");
      }
    }
  }, [searchTerm, events]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="main-wrap">
        <section className="upcoming-events">
          <h1>{makePageTitle(city, state)}</h1>
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
          <NavigationBar
            events={events}
            locationData={locationData}
            setSearchTerm={setSearchTerm}
          />
        )}
      </div>
    </Layout>
  );
}

// Gets slugs for each dynamic page
export async function getStaticPaths() {
  const paths = getLocationIds();
  return {
    paths,
    fallback: false,
  };
}

// Gets data for each page based on slug
export async function getStaticProps({ params }) {
  const locationData = getLocationData(params.id);
  return {
    props: {
      locationData,
    },
  };
}
