import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import EventCard from "../../components/EventCard/EventCard";
import getEvents from "../../utils/getEvents";
import Spinner from "../../components/Spinner/Spinner";
import NavigationBar from "../../components/NavigationBar/NavigataionBar";
import { searchFilter, clearSearch } from "../../utils/searchFilter";

export default function Location({ locationData }) {
  const { city, state, id } = locationData;
  const title = `Music Events in ${city}, ${state}`;
  const [events, SetEvents] = useState([]);
  const [loading, SetLoading] = useState(true);
  const dataFetchedRef = useRef(false);
  const [searchTerm, SetSearchTerm] = useState();

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getEvents(id, SetEvents, SetLoading);
  }, [id]);

  useEffect(() => {
    if (searchTerm && events) {
      const filteredEvents = searchFilter(searchTerm, events);
      if (filteredEvents) {
        SetEvents(filteredEvents);
        SetSearchTerm("");
      }
    }
  }, [searchTerm, events]);

  // const handleClick = () => {
  //   console.log(events);
  //   const allEvents = clearSearch(events);
  //   SetEvents(allEvents);
  // };

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      {/* <SearchBar /> */}
      <h1>Music Events Near {city ? `${city}, ${state}` : state}</h1>
      {/* <div onClick={() => handleClick()}>
        <section id="searchresults">
          <p>Showing result for: {searchTerm}</p>
        </section>
      </div> */}
      <section>
        {loading && <Spinner isLoading={loading} />}
        {events &&
          events.map((event, index) => {
            return <EventCard event={event} key={index} />;
          })}
      </section>
      {events && (
        <NavigationBar
          data={events}
          locationData={locationData}
          SearchTerm={SetSearchTerm}
        />
      )}
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
