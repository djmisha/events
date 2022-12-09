import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import { UserLocationService } from "../utils/getIpAddress";
import { useEffect, useInsertionEffect, useRef, useState } from "react";
import getEventsForLocation from "../utils/getEventsForLocation";
import EventCard from "../components/EventCard/EventCard";

export async function getStaticProps() {
  const locations = getLocations();
  return {
    props: {
      locations,
    },
  };
}

export default function Home({ locations }) {
  const [locationID, SetLocationID] = useState();
  const [events, SetEvents] = useState([]);
  const [loading, SetLoading] = useState(true);
  const dataLocationFetchedRef = useRef(false);

  useEffect(() => {
    const getLocationID = async () => {
      const id = await UserLocationService();
      SetLocationID(id);
    };
    if (dataLocationFetchedRef.current) return;
    dataLocationFetchedRef.current = true;
    getLocationID();
  }, []);

  useInsertionEffect(() => {
    if (locationID) getEventsForLocation(locationID, SetEvents, SetLoading);
  }, [locationID]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        {events &&
          !loading &&
          events.map((event, index) => {
            if (index < 10) return <EventCard event={event} key={index} />;
          })}
      </section>
      <section>
        {locations.map(({ id, city, state, slug }) => (
          <Link href={`/events/${slug}/`} key={id}>
            <p>{city || state}</p>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
