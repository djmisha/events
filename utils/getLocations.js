import locations from "./locations.json";

// replace space with dash & lowercase
const toSlug = (string) => {
  return string.split(" ").join("-").toLowerCase();
};

// add city and state to thelocations array
const addCityAndState = (locations) => {
  const cityAndState = [];
  // add city
  locations.map((location) => {
    if (location.city) cityAndState.push(location);
  });
  // add States
  locations.map((location) => {
    if (!location.city) cityAndState.push(location);
  });
  return cityAndState;
};

// gets id's for each location
export const getLocationIds = () => {
  const allLocations = addCityAndState(locations);
  return allLocations.map((location) => {
    let id;
    if (location.city) {
      id = toSlug(location.city);
    } else {
      id = toSlug(location.state);
    }
    return {
      params: {
        id,
      },
    };
  });
};

// gets all locations for homepage
export const getLocations = () => {
  const allLocations = addCityAndState(locations);
  return allLocations.map((location) => {
    const { id, city, state } = location;
    let slug;
    if (location.city) slug = toSlug(location.city);
    if (!location.city) slug = toSlug(location.state);
    return {
      id,
      city,
      state,
      slug,
    };
  });
};

// Matches Slug with Location and returns data about location
export const getLocationData = (slug) => {
  let data;
  const allLocations = addCityAndState(locations);
  allLocations.map((location) => {
    if (location.city) {
      if (toSlug(location.city) === slug) data = location;
    }
    if (toSlug(location.state) === slug) data = location;
  });

  return {
    slug,
    ...data,
  };
};
