import locations from "./locations.json";

/**
 * Services to retreive the location based on user IP
 * IP -> Location -> Match to Location ID -> set in Local Storage
 */
export const UserLocationService = async () => {
  if (hasUserLocation()) {
    return matchToLocation();
  } else {
    let id;

    const url = "https://api.ipify.org?format=json";
    const response = await fetch(url);
    responseFallback(response, id); // is this neeed?
    const jsonData = await response.json();

    const ip = jsonData.ip;
    const locationURL = `https://ipapi.co/${ip}/json/`;
    const locationResponse = await fetch(locationURL);
    responseFallback(locationResponse, id); // is this neeed?
    const locationData = await locationResponse.json();

    const { city, region_code: state } = locationData;

    locations.forEach(function (location) {
      if (city === location.city) {
        id = location.id;
        return id;
      }
      if (!id && state === location.stateCode) {
        id = location.id;
        return id;
      }
    });

    return {
      city,
      state,
      id,
    };
  }
};

const matchToLocation = () => {
  let city;
  let state;
  const id = localStorage.getItem("locID");

  locations.forEach((location) => {
    if (location.id === Number(id)) {
      city = location.city;
      state = location.state;
    }
  });

  return {
    city,
    state,
    id,
  };
};

// @TODO refactor w/ try catch
const responseFallback = (response, id) => {
  if (response.status != 200) {
    return fallback;
  }
};

export const fallbackLocation = {
  city: "San Diego",
  state: "California",
  id: 10,
};

export const storeUserLocation = (id) => {
  localStorage.setItem("locID", id);
};

const hasUserLocation = () => {
  const id = localStorage.getItem("locID");
  if (id) return true;
  return false;
};
