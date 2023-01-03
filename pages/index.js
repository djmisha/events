import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import { UserLocationService } from "../utils/getUserLocation.js";
import { useEffect, useRef, useState } from "react";
import getEvents from "../utils/getEvents";
import EventCard from "../components/EventCard/EventCard";
import Spinner from "../components/Spinner/Spinner";

export async function getStaticProps() {
  const locations = getLocations();
  return {
    props: {
      locations,
    },
  };
}

export default function Home({ locations }) {
  const [userLocation, SetUserLocation] = useState();
  const [events, SetEvents] = useState([]);
  const [loading, SetLoading] = useState(true);
  const dataLocationFetchedRef = useRef(false);

  useEffect(() => {
    const getUserLocation = async () => {
      const id = await UserLocationService();
      SetUserLocation(id);
    };
    if (dataLocationFetchedRef.current) return;
    dataLocationFetchedRef.current = true;
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) getEvents(userLocation.id, SetEvents, SetLoading);
  }, [userLocation]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {loading && <Spinner isLoading={loading} text="Finding location" />}
      {userLocation && (
        <h1>Upcoming Events in {userLocation.city || userLocation.state}</h1>
      )}
      <section>
        {events &&
          !loading &&
          events.map((event, index) => {
            if (index < 5) return <EventCard event={event} key={index} />;
          })}
      </section>
      {events && !loading && (
        <button>
          See all events in {userLocation.city || userLocation.state}
        </button>
      )}
      <h1>Events in Other Locations</h1>
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
