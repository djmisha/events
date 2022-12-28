import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import EventCard from "../../components/EventCard/EventCard";
import getEvents from "../../utils/getEvents";
import Spinner from "../../components/Spinner/Spinner";
import NavigationBar from "../../components/NavigationBar/NavigataionBar";
// import SearchTerm from "../../utils/searchHook";
import SearchFilter from "../../utils/searchFilter";

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
    // console.log(searchTerm);
    const searchResults = SearchFilter(searchTerm, events, SetEvents);
    if (searchResults) {
      events.forEach((event) => {
        event.isVisible = false;
        searchResults.forEach((result) => {
          if (result.id === event.id) {
            event.isVisible = true;
            console.log(event.isVisible);
          } else {
          }
        });
        SetEvents(events);
      });
    }
    console.log(searchTerm);
  }, [searchTerm, events]);

  useEffect(() => {
    console.log("eventsUpdate");
  }, [events]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      {/* <SearchBar /> */}
      {/* <Counter /> */}
      <h1>Music Events Near {city ? `${city}, ${state}` : state}</h1>
      {/* <button onClick={() => dispatch(addEvents(events))}>Test</button> */}
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
