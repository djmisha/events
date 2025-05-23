import locations from "./locations.json";

/**
 * Services to retreive the location based on user IP
 * IP -> Location -> Match to Location ID -> return location object
 */
export const UserLocationService = async () => {
  try {
    const url = "https://api.ipify.org?format=json";
    const response = await fetch(url);
    const jsonData = await response.json();

    const ip = jsonData.ip;
    const locationURL = `https://ipapi.co/${ip}/json/`;
    const locationResponse = await fetch(locationURL);
    const locationData = await locationResponse.json();
    const { city, region_code: state } = locationData;

    const id = getLocationId(locations, city, state);
    const locationObject = createLocationObject(city, state, id);

    if (id) return locationObject;
    return undefined;
  } catch (error) {
    throw Error(error);
  }
};

export const getLocationId = (locations, city, state) => {
  let id;

  locations.forEach(function (location) {
    if (city === location.city) {
      id = location.id;
    }
    if (!id && state === location.stateCode) {
      id = location.id;
    }
  });

  return id;
};

export const createLocationObject = (city, state, id) => {
  const stateCode = state;

  locations.find((location) => {
    if (location.id === id) return (state = location.state);
  });

  return {
    city,
    state,
    stateCode,
    id,
  };
};

// check if city matches a city in the locations.json
export const matchesCity = (city) => {
  let hasCity = false;
  locations.forEach((location) => {
    if (location.city === city) hasCity = true;
  });

  return hasCity;
};
