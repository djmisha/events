import { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../../features/AppContext.js";
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
import { getEventsHome } from "../../utils/getEvents";
import EventCard from "../EventCard/EventCard";

const Locator = ({ locations }) => {
  // App context
  const { locationCtx, addLocation } = useContext(AppContext);

  // Events state
  const [events, setEvents] = useState();
  const [loading, setLoading] = useState(true);
  const eventsFetchedRef = useRef(false);

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
        addLocation(location);
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
              addLocation(geoLocation);

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
                addLocation(location);
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
  }, [locations, addLocation]);

  useEffect(() => {
    if (userLocation?.id && !eventsFetchedRef.current) {
      eventsFetchedRef.current = true;
      getEventsHome(userLocation.id, setEvents, setLoading);
    }
  }, [userLocation]);

  return (
    <>
      {userLocation && events && (
        <div className="home-your-location">
          <h2>
            Near You in{" "}
            <strong>
              {cityOrState(userLocation.city, userLocation.state)}
            </strong>
          </h2>
          <div id="artistfeed">
            {events?.slice(0, 10).map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
          <button>
            <a
              href={`events/${locationUrl(userLocation, hasCity)}`}
              className="secondary"
            >
              All events in {cityOrState(userLocation.city, userLocation.state)}
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
