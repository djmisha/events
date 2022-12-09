import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import EventCard from "../../components/EventCard/EventCard";
import Image from "next/image";
import getEventsForLocation from "../../utils/getEventsForLocation";

export default function Location({ locationData }) {
  const { city, state, id } = locationData;
  const title = `Events in ${city}, ${state}`;
  const [events, SetEvents] = useState([]);
  const [loading, SetLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getEventsForLocation(id, SetEvents, SetLoading);
  }, [id]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>Events Near {city || state}</h1>
      <section>
        {
          // @todo refactor loader to its own component
        }
        {loading && (
          <Image
            src="/images/loading.svg"
            alt="loading"
            width={100}
            height={100}
          />
        )}
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
