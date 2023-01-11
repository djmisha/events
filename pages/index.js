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
  const isFallbackLocation = useRef(false);

  useEffect(() => {
    const getUserLocation = async () => {
      const id = await UserLocationService();
      setUserLocation(id);
      if (!id) {
        setUserLocation(fallbackLocation);
        isFallbackLocation.current = true;
      }
    };
    if (dataLocationFetchedRef.current) return;
    dataLocationFetchedRef.current = true;
    isFallbackLocation.current = false;
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      getEvents(userLocation.id, SetEvents, SetLoading);
    }
  }, [userLocation]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {loading && <Spinner isLoading={loading} text="Finding location" />}
      {isFallbackLocation.current && (
        <p className="location-notice">
          We could not determine your location, so we&apos;re showing events in
          California. Update your location below.
        </p>
      )}
      {userLocation && <EventsModule locationData={userLocation} />}
    </Layout>
  );
}
