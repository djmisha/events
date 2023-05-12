import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations, locationUrl } from "../utils/getLocations";
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
import { urlBigData, cityOrState } from "../utils/utilities";
import Login from "../components/Account/Login";
import Hamburger from "../components/Hamburger/Hamburger";
import LocationAutoComplete from "../components/SearchAutoComplete/LocationAutoComplete";

export async function getServerSideProps() {
  const locations = getLocations();

  return {
    props: {
      locations,
    },
  };
}

export default function Home({ locations }) {
  const [userLocation, setUserLocation] = useState();
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

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Hamburger locationData={userLocation} />
      <div className="hero-home">
        <h1>Find EDM Events</h1>
        <p>Discover dance music in a city near you </p>
        <div className="home-search">
          <LocationAutoComplete />
        </div>
        {userLocation && (
          <div className="home-your-location">
            <p>Your location is</p>
            <p>
              <strong>
                {cityOrState(userLocation.city, userLocation.state)}
              </strong>
            </p>
            <button>
              <a
                href={`events/${locationUrl(userLocation)}`}
                className="secondary"
              >
                View Events
              </a>
            </button>
          </div>
        )}
      </div>
      {/* Location fallback */}
      {isFallbackLocation.current && (
        <p className="location-notice">
          We could not determine your location, so we&apos;re showing events in
          San Diego, California. Update your location below.
        </p>
      )}
      <Login />
    </Layout>
  );
}
