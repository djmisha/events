import locations from "./locations.json";

/**
 * Services to retreive the location based on user IP
 * IP -> Location -> Match to Location ID -> set in Local Storage
 */
export const UserLocationService = async () => {
  let id;

  const url = "https://api.ipify.org?format=json";
  const response = await fetch(url);
  responseFallback(response, id);
  const jsonData = await response.json();

  const ip = jsonData.ip;
  const locationURL = `https://ipapi.co/${ip}/json/`;
  const locationResponse = await fetch(locationURL);
  responseFallback(locationResponse, id);
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

  if (!id) id = 10; // fallsback to CA
  debugger;

  return {
    city,
    state,
    id,
  };
};

const responseFallback = (response, id) => {
  if (response.status != 200) {
    id = 10;
    return;
  }
};
