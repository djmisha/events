import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import {
  UserLocationService,
  fallbackLocation,
  hasUserLocation,
  matchToLocation,
  matchToId,
} from "../utils/getUserLocation.js";
import { useEffect, useRef, useState } from "react";
import getEvents from "../utils/getEvents";
import Spinner from "../components/Spinner/Spinner";
import EventsModule from "../components/EventsModule/EventsModule";
import { urlBigData } from "../utils/utilities";

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
  const geoFetchedRef = useRef(false);
  const reverseGeoFetchedRef = useRef(false);
  const dataEventsFetchedRef = useRef(false);
  const isFallbackLocation = useRef(false);

  useEffect(() => {
    /**
     * PRIMARY METHOD TO GET USERS LOCATION
     * uses geoLocation.
     *
     * Consider a hook: https://gist.github.com/whoisryosuke/e3ad7f43924dec60a12e247efe743e70
     */
    const getGeoLocation = async () => {
      if (hasUserLocation()) {
        const location = matchToLocation();
        setUserLocation(location);
      }
      let location;

      if (navigator.geolocation) {
        location = navigator.geolocation.getCurrentPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const getReverseGeo = async (latitude, longitude) => {
              if (reverseGeoFetchedRef.current) return;
              reverseGeoFetchedRef.current = true;

              const url = urlBigData(latitude, longitude);
              const locationResponse = await fetch(url);
              const locationData = await locationResponse.json();
              const { city, principalSubdivision: state } = locationData;
              let id;

              locations.forEach(function (location) {
                if (city === location.city) {
                  id = location.id;
                }
                if (!id && state === location.stateCode) {
                  id = location.id;
                }
                return id;
              });

              return {
                city,
                state,
                id,
              };
            };

            let geoLocation = await getReverseGeo(latitude, longitude);

            if (geoLocation) {
              if (geoFetchedRef.current) return;
              setUserLocation(geoLocation);
              geoFetchedRef.current = true;
            }
          },
          /**
           * SECONDARY METHOD TO GET USERS LOCATION
           * IF BROWSER PERMISSION DENIED
           */
          (error) => {
            if (error.PERMISSION_DENIED) {
              const getUserLocation = async () => {
                let location;

                location = await UserLocationService();
                setUserLocation(location);
                /**
                 * FINAL FALL BACK - if the 2 other ways to get a location fail
                 * we set it to a fallback value
                 */
                if (!location) {
                  setUserLocation(fallbackLocation);
                  isFallbackLocation.current = true;
                }
              };
              if (dataLocationFetchedRef.current) return;
              dataLocationFetchedRef.current = true;
              isFallbackLocation.current = false;
              getUserLocation();
            }
          }
        );
      }
    };
    getGeoLocation();
  }, [locations]);

  useEffect(() => {
    if (userLocation) {
      if (dataEventsFetchedRef.current) return;
      getEvents(userLocation.id, SetEvents, SetLoading);
      dataEventsFetchedRef.current = true;
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
