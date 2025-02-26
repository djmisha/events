import { urlBigData } from "../../utils/utilities.js";
import {
  UserLocationService,
  matchesCity,
  getLocationId,
  createLocationObject,
} from "../../utils/getUserLocation.js";

export const getGeoLocation = async (
  locations,
  setUserLocation,
  addLocation,
  setHasCity
) => {
  let location;

  if (navigator.geolocation) {
    location = navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        await handleGeolocationSuccess(
          latitude,
          longitude,
          locations,
          setUserLocation,
          addLocation,
          setHasCity
        );
      },
      (error) =>
        handleGeolocationError(error, setUserLocation, addLocation, setHasCity)
    );
  }
};

const handleGeolocationSuccess = async (
  latitude,
  longitude,
  locations,
  setUserLocation,
  addLocation,
  setHasCity
) => {
  const url = urlBigData(latitude, longitude);
  const locationResponse = await fetch(url);
  const locationData = await locationResponse.json();
  const { city, principalSubdivision: state } = locationData;

  setHasCity(matchesCity(city));

  const id = getLocationId(locations, city, state);
  const locationObject = createLocationObject(city, state, id);

  if (id) {
    setUserLocation(locationObject);
    addLocation(locationObject);
  }
};

const handleGeolocationError = async (
  error,
  setUserLocation,
  addLocation,
  setHasCity
) => {
  if (error.PERMISSION_DENIED) {
    const location = await UserLocationService();
    setHasCity(matchesCity(location.city));
    setUserLocation(location);
    addLocation(location);
  }
};
