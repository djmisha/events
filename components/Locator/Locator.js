import { useEffect, useRef, useState } from "react";
import { locationUrl } from "../../utils/getLocations";
import {
  UserLocationService,
  hasUserLocation,
  matchToLocation,
} from "../../utils/getUserLocation.js";
import { urlBigData, cityOrState } from "../../utils/utilities";

const Locator = ({ locations }) => {
  const [userLocation, setUserLocation] = useState();
  const dataLocationFetchedRef = useRef(false);
  const geoFetchedRef = useRef(false);
  const reverseGeoFetchedRef = useRef(false);

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
              let id;

              locations.forEach(function (location) {
                if (city === location.city) {
                  id = location.id;
                }
                if (!id && state === location.stateCode) {
                  id = location.id;
                }
                // dont need to return id here, its set above
                // return id;
              });

              // if ID is undefined, we still return this object
              // so that means we can get a city and state BUT NO ID
              // so it will return a city/state that is not included in our available locations

              const locationObject = {
                city,
                state,
                id,
              };

              // should return only if we have matched to an ID
              if (id) return locationObject;
              return false;
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

  return (
    <>
      {
        // what to check for here?  just userLocation? is probs enough
        userLocation?.id && (
          <div className="home-your-location">
            <p>Your default location is</p>
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
        )
      }
    </>
  );
};

export default Locator;
