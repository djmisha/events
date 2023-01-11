import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import {
  UserLocationService,
  fallbackLocation,
} from "../utils/getUserLocation.js";
import { useEffect, useRef, useState } from "react";
import getEvents from "../utils/getEvents";
import Spinner from "../components/Spinner/Spinner";
import EventsModule from "../components/EventsModule/EventsModule";

export async function getStaticProps() {
  const locations = getLocations();
  return {
    props: {
      locations,
    },
  };
}

export default function Home({ locations }) {
  const [userLocation, setUserLocation] = useState();
  const [events, SetEvents] = useState([]);
  const [loading, SetLoading] = useState(true);
  const dataLocationFetchedRef = useRef(false);

  useEffect(() => {
    const getUserLocation = async () => {
      const id = await UserLocationService();
      setUserLocation(id);
      if (!id) setUserLocation(fallbackLocation);
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
      {userLocation && <EventsModule locationData={userLocation} />}
    </Layout>
  );
}
