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
import { useEffect, useInsertionEffect, useRef, useState } from "react";
import getEvents from "../utils/getEvents";
import Spinner from "../components/Spinner/Spinner";
import EventsModule from "../components/EventsModule/EventsModule";
import { urlBigData } from "../utils/utilities";
import Image from "next/image";
import Link from "next/link";
import { decode } from "html-entities";

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

  const [music, setMusic] = useState();
  const [musicLoading, setMusicLoading] = useState(true);

  useInsertionEffect(() => {
    const getMusic = async () => {
      const rand = Math.floor(Math.random() * 20);
      const URL = `https://music.sandiegohousemusic.com/wp-json/wp/v2/posts?category=music&page=${rand}&per_page=4`;

      await fetch(URL)
        .then(function (response) {
          response.json().then((res) => {
            console.log(res);
            const music = res.map((item) => {
              const {
                id,
                link,
                jetpack_featured_media_url: image,
                title,
                content,
              } = item;
              const { rendered: headline } = title;

              return (
                <div key={id} className="single-music">
                  <Link href={link} target="_blank" rel="noopener">
                    <div className="single-music-image">
                      <Image
                        src={image}
                        alt={headline}
                        width={200}
                        height={200}
                      />
                    </div>

                    <span>{decode(headline)}</span>
                  </Link>
                </div>
              );
            });
            setMusic(music);
            setMusicLoading(false);
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    };
    getMusic();
  }, []);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <h1>Dance Music Events & DJ Mixes</h1>
      {musicLoading && <Spinner isLoading={musicLoading} text="Loading..." />}
      {music && (
        <>
          <h2>Listen to DJ Mixes</h2>
          <div id="musicfeed">{music}</div>
        </>
      )}
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
