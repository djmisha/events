import { useEffect, useRef, useState } from "react";
import { locationUrl } from "../../utils/getLocations";
import {
  UserLocationService,
  hasUserLocation,
  matchToLocation,
  matchesCity,
  getLocationId,
  createLocationObject,
} from "../../utils/getUserLocation.js";
import { urlBigData, cityOrState } from "../../utils/utilities";
import getEvents from "../../utils/getEvents";
import EventCard from "../EventCard/EventCard";
import SpecialEventsModule from "../EventsModule/SpecialEventsModule.js";

const Locator = ({ locations }) => {
  // Events state
  const [events, setEvents] = useState();
  const [loading, setLoading] = useState(true);

  // Loction state
  const [userLocation, setUserLocation] = useState();
  const [hasCity, setHasCity] = useState(false);
  const dataLocationFetchedRef = useRef(false);
  const geoFetchedRef = useRef(false);
  const reverseGeoFetchedRef = useRef(false);
  const setMatchesCity = (city) => {
    if (city && matchesCity(city)) setHasCity(true);
  };

  useEffect(() => {
    const getGeoLocation = async () => {
      let location;
      // If we have a cookie, use it
      if (hasUserLocation()) {
        location = matchToLocation();
        setUserLocation(location);
        if (location.city) setMatchesCity(location.city);
        return;
      }

      /**
       * PRIMARY METHOD TO GET USERS LOCATION
       * Browser GeoLocation
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

              setMatchesCity(city);

              const id = getLocationId(locations, city, state);
              const locationObject = createLocationObject(city, state, id);

              if (id) return locationObject;
              return undefined;
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
           * IF BROWSER LOCATION PERMISSION DENIED
           */
          (error) => {
            if (error.PERMISSION_DENIED) {
              const getUserLocation = async () => {
                let location;
                location = await UserLocationService();
                setMatchesCity(location.city);
                setUserLocation(location);
              };

              if (dataLocationFetchedRef.current) return;
              dataLocationFetchedRef.current = true;
              getUserLocation();
            }
          }
        );
      }
    };
    getGeoLocation();
  }, [locations]);

  useEffect(() => {
    if (userLocation?.id) getEvents(userLocation.id, setEvents, setLoading);
  }, [userLocation]);

  return (
    <>
      {userLocation && events && (
        <div className="home-your-location">
          <h2>
            Near You in&nbsp;
            <strong>
              {cityOrState(userLocation.city, userLocation.state)}
            </strong>
          </h2>
          {events && userLocation.city === "San Diego" && (
            <SpecialEventsModule locationData={userLocation} />
          )}
          <div id="artistfeed">
            {events &&
              events.map((event, index) => {
                if (index < 10) return <EventCard event={event} key={index} />;
              })}
          </div>
          <button>
            <a
              href={`events/${locationUrl(userLocation, hasCity)}`}
              className="secondary"
            >
              View All
            </a>
          </button>
        </div>
      )}

      {!userLocation && (
        <div className="home-your-location">
          <p>Scroll down for locations</p>
          <p>
            <strong>&darr;</strong>
          </p>
        </div>
      )}
    </>
  );
};

export default Locator;
