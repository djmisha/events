import locations from "./locations.json";

// replace space with dash & lowercase
export const toSlug = (string) => {
  return string.split(" ").join("-").toLowerCase();
};

// add city and state to the locations array
const addCityAndState = (locations) => {
  const cities = [];
  const states = [];
  const cityAndState = [];
  // add city
  locations.map((location) => {
    if (location.city) cities.push(location);
  });
  // add States
  locations.map((location) => {
    if (!location.city) states.push(location);
  });

  // sort the arrays alphabetically
  cities.sort((a, b) => {
    if (a.city < b.city) return -1;
    if (a.city > b.city) return 1;
    return 0;
  });

  states.sort((a, b) => {
    if (a.state < b.state) return -1;
    if (a.state > b.state) return 1;
    return 0;
  });

  // join the arrays into a single array
  cities.map((city) => {
    cityAndState.push(city);
  });
  states.map((state) => {
    cityAndState.push(state);
  });

  return cityAndState;
};

export const allLocations = addCityAndState(locations);

// gets all locations for homepage
export const getLocations = () => {
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

// returns the slug of the location for the homepage link
export const locationUrl = (data, hasCity) => {
  let slug;
  const { city, state } = data;

  if (hasCity) slug = toSlug(city);
  else slug = toSlug(state);

  return slug;
};

// Create internal events URL path for a location
export const getLocationEventsUrl = (location) => {
  if (!location) return null;

  let slug;

  // Prioritize city if available, otherwise use state
  if (location.city) {
    slug = toSlug(location.city);
  } else if (location.state) {
    slug = toSlug(location.state);
  } else {
    return null;
  }

  return `/events/${slug}`;
};

// Get location slug for URL generation
export const getLocationSlug = (location) => {
  if (!location) return null;

  // Prioritize city if available, otherwise use state
  if (location.city) {
    return toSlug(location.city);
  } else if (location.state) {
    return toSlug(location.state);
  }

  return null;
};

// Validate if a location has a valid URL path
export const hasValidLocationUrl = (location) => {
  return !!(location && (location.city || location.state));
};
