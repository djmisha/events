import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import EventCard from "../../components/EventCard/EventCard";
import getEvents from "../../utils/getEvents";
import Spinner from "../../components/Spinner/Spinner";

export default function Location({ locationData }) {
  const { city, state, id } = locationData;
  const title = `Events in ${city}, ${state}`;
  const [events, SetEvents] = useState([]);
  const [loading, SetLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getEvents(id, SetEvents, SetLoading);
  }, [id]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>Events Near {city || state}</h1>
      <section>
        {loading && <Spinner isLoading={loading} />}
        {events &&
          events.map((event, index) => {
            return <EventCard event={event} key={index} />;
          })}
      </section>
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
