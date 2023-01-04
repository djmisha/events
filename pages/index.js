import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import { getLocations, toSlug } from "../utils/getLocations";
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
  const [slug, setSlug] = useState();
  const dataLocationFetchedRef = useRef(false);

  useEffect(() => {
    const getUserLocation = async () => {
      const id = await UserLocationService();
      debugger;
      SetUserLocation(id);
      setSlug(toSlug(id.city || id.state));
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
        <button className="button">
          <Link href={`events/${slug}`}>
            All events in {userLocation.city || userLocation.state}
          </Link>
        </button>
      )}
      <h2>All Locations</h2>
      <section className="home-locations">
        {locations.map(({ id, city, state, slug }) => (
          <div key={id}>
            <Link href={`/events/${slug}/`}>{city || state}</Link>
          </div>
        ))}
      </section>
    </Layout>
  );
}
