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
  let cityData = null;
  let stateData = null;

  // First pass: collect all matches
  allLocations.forEach((location) => {
    if (location.city && toSlug(location.city) === slug) {
      cityData = location;
    }
    if (!location.city && toSlug(location.state) === slug) {
      stateData = location;
    }
  });

  // Prioritize city matches over state matches
  const data = cityData || stateData;

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

// Check if a slug corresponds to a state (not a city)
export const isStateLandingPage = (slug) => {
  const stateEntry = allLocations.find(
    (location) => !location.city && toSlug(location.state) === slug
  );
  return !!stateEntry;
};

// Get all cities within a specific state
export const getCitiesInState = (stateSlug) => {
  // First find the state name from the slug
  const stateEntry = allLocations.find(
    (location) => !location.city && toSlug(location.state) === stateSlug
  );

  if (!stateEntry) return [];

  // Get all cities in that state
  const cities = allLocations
    .filter((location) => location.city && location.state === stateEntry.state)
    .map((location) => ({
      id: location.id,
      name: location.city,
      slug: toSlug(location.city),
      state: location.state,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return cities;
};

// Get state information from slug
export const getStateInfo = (stateSlug) => {
  const stateEntry = allLocations.find(
    (location) => !location.city && toSlug(location.state) === stateSlug
  );

  if (!stateEntry) return null;

  const cities = getCitiesInState(stateSlug);

  return {
    id: stateEntry.id,
    name: stateEntry.state,
    slug: stateSlug,
    cities: cities,
    hasCities: cities.length > 0,
  };
};
