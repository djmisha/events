import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import {
  getAritstIds,
  getArtistData,
  getArtistEvents,
} from "../../utils/getArtists";
import EventCard from "../../components/EventCard/EventCard";
import Hamburger from "../../components/Hamburger/Hamburger";

export default function Artist({ artistData }) {
  const { name, id } = artistData;
  const [events, setEvents] = useState();
  const dataFetchedRef = useRef();
  const title = `${name} - Upcoming Events & Artist Informaton`;
  const description = `${name} Tour Dates, Shows, Concert Tickets & Live Streams. Learn more about ${name}`;

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    getArtistEvents(id, setEvents);
  }, [id]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Hamburger />
      <h1>{name} Events</h1>
      <main id="artistfeed">
        {events &&
          events.map((event, index) => {
            return <EventCard event={event} key={index} />;
          })}
      </main>
    </Layout>
  );
}

// Gets slugs for each dynamic page
export async function getStaticPaths() {
  const paths = getAritstIds();
  return {
    paths,
    fallback: false,
  };
}

/**
 * Gets data for each page based on slug
 * @param {*} params
 * @returns locationData
 */
export async function getStaticProps({ params }) {
  const artistData = getArtistData(params.id);

  return {
    props: {
      artistData,
    },
  };
}
