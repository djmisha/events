import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import {
  UserLocationService,
  fallbackLocation,
  hasUserLocation,
  matchToLocation,
} from "../utils/getUserLocation.js";
import { useEffect, useRef, useState } from "react";
import getEvents from "../utils/getEvents";
import getMusic from "../utils/getMusic";
import Spinner from "../components/Spinner/Spinner";
import EventsModule from "../components/EventsModule/EventsModule";
import { urlBigData } from "../utils/utilities";
import MusicModule from "../components/MusicModule/MusicModule";

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
    const getGeoLocation = async () => {
      let location;
      // If we have a cookie, use it
      if (hasUserLocation()) {
        location = matchToLocation();
        setUserLocation(location);
        return;
      }
      /**
       * PRIMARY METHOD TO GET USERS LOCATION
       * Brower GeoLocation
       *
       * Consider a hook: https://gist.github.com/whoisryosuke/e3ad7f43924dec60a12e247efe743e70
       */
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
                 * FINAL FALLBACK - if the 2 other ways to get a location fail
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

  /**
   * DJ Mixes
   */
  const [music, setMusic] = useState();
  const [musicLoading, setMusicLoading] = useState(true);
  const dataMusicFetchedRef = useRef(false);

  useEffect(() => {
    const fetchMusic = async () => {
      await getMusic(setMusic, setMusicLoading);
    };
    if (dataMusicFetchedRef.current) return;
    dataMusicFetchedRef.current = true;
    fetchMusic();
  }, [music]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="hero-home">
        <h1>Dance & House Music</h1>
        <p>Discover dance music in a city near you and around the world </p>
        <div className="home-cta">
          <div>
            <button>
              <a href="#music" className="secondary">
                Listen To Music &rarr;
              </a>
            </button>
          </div>
          <div>
            <button>
              <a href="#eventfeed" className="secondary">
                View Events &rarr;
              </a>
            </button>
          </div>
        </div>
      </div>
      {!userLocation && (
        <Spinner isLoading={loading} text="Loading Location..." />
      )}
      {/* Events Module */}
      {userLocation && (
        <EventsModule locationData={userLocation} isHome={true} />
      )}
      {music && (
        <>
          <h2 id="music">Listen to DJ Mixes</h2>
          <MusicModule music={music} />
        </>
      )}
      {/* Location fallback */}
      {isFallbackLocation.current && (
        <p className="location-notice">
          We could not determine your location, so we&apos;re showing events in
          San Diego, California. Update your location below.
        </p>
      )}
    </Layout>
  );
}
