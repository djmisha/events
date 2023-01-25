import locations from "./locations.json";

/**
 * Services to retreive the location based on user IP
 * IP -> Location -> Match to Location ID -> set in Local Storage
 */
export const UserLocationService = async () => {
  try {
    let id;

    const url = "https://api.ipify.org?format=json";
    const response = await fetch(url);
    const jsonData = await response.json();

    const ip = jsonData.ip;
    const locationURL = `https://ipapi.co/${ip}/json/`;
    const locationResponse = await fetch(locationURL);
    const locationData = await locationResponse.json();

    const { city, region_code: state } = locationData;

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
  } catch (error) {
    throw Error(error);
  }
};

// export const matchToId = (locations, city, state) => {
//   let id;
//   locations.forEach(function (location) {
//     if (city === location.city) {
//       id = location.id;
//     }
//     if (!id && state === location.stateCode) {
//       id = location.id;
//     }
//     return id;
//   });
// };

export const matchToLocation = () => {
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

const defaultLocation = (response, id) => {
  if (response.status != 200) {
    return fallback;
  }
};

// fallback location object
export const fallbackLocation = {
  city: "San Diego",
  state: "California",
  id: 81,
};

// Sets local storage with location
export const storeUserLocation = (id) => {
  localStorage.setItem("locID", id);
};

// Checks local storage for location
export const hasUserLocation = () => {
  const id = localStorage.getItem("locID");
  if (id) return true;
  return false;
};
