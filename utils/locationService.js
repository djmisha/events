import locations from "./locations.json";

const LOCATION_COOKIE_NAME = "userLocation";

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 */
const deleteCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

/**
 * Set a cookie with specified name, value, and options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value (will be JSON stringified if object)
 * @param {number} days - Expiration in days (default: 30)
 */
const setCookie = (name, value, days = 30) => {
  try {
    if (value === null || value === undefined) {
      deleteCookie(name);
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const cookieValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    document.cookie = `${name}=${encodeURIComponent(
      cookieValue
    )};expires=${expires.toUTCString()};path=/`;
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Find the closest location from coordinates
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Object|null} Closest location object or null if none found
 */
export const findClosestLocation = (latitude, longitude) => {
  if (!latitude || !longitude || !locations?.length) {
    return null;
  }

  let closestLocation = null;
  let shortestDistance = Infinity;

  // First pass: Look for exact city matches within reasonable distance
  for (const location of locations) {
    if (location.city && location.latitude && location.longitude) {
      const distance = calculateDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude
      );

      // Prioritize city matches within 100km
      if (distance < 100 && distance < shortestDistance) {
        closestLocation = location;
        shortestDistance = distance;
      }
    }
  }

  // If no close city found, find closest state/province
  if (!closestLocation) {
    for (const location of locations) {
      if (location.latitude && location.longitude) {
        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );

        if (distance < shortestDistance) {
          closestLocation = location;
          shortestDistance = distance;
        }
      }
    }
  }

  return closestLocation;
};

/**
 * Create standardized location object
 * @param {Object} locationData - Raw location data
 * @returns {Object} Standardized location object
 */
export const createLocationObject = (locationData) => {
  if (!locationData) return null;

  return {
    id: locationData.id,
    city: locationData.city,
    state: locationData.state,
    stateCode: locationData.stateCode,
    country: locationData.country,
    countryCode: locationData.countryCode,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
  };
};

/**
 * Get user's current position using browser geolocation
 * @returns {Promise<Object>} Promise resolving to coordinates object
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = "Unknown error occurred";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Detect user location and find closest match
 * @returns {Promise<Object|null>} Promise resolving to location object or null
 */
export const detectUserLocation = async () => {
  try {
    const coordinates = await getCurrentPosition();
    const closestLocation = findClosestLocation(
      coordinates.latitude,
      coordinates.longitude
    );

    if (closestLocation) {
      return createLocationObject(closestLocation);
    }

    return null;
  } catch (error) {
    console.warn("Location detection failed:", error.message);
    throw error;
  }
};

/**
 * Save location to cookie
 * @param {Object} location - Location object to save
 */
export const saveLocationToCookie = (location) => {
  if (!location) return;

  try {
    setCookie(LOCATION_COOKIE_NAME, location, 365); // Save for 1 year
  } catch (error) {
    console.error("Failed to save location to cookie:", error);
  }
};

/**
 * Get saved location from cookie
 * @returns {Object|null} Saved location object or null
 */
export const getSavedLocation = () => {
  try {
    return getCookie(LOCATION_COOKIE_NAME);
  } catch (error) {
    console.error("Failed to get saved location:", error);
    return null;
  }
};

/**
 * Update user location and save to cookie
 * @param {Object} location - New location object
 */
export const updateUserLocation = (location) => {
  if (!location) return;

  saveLocationToCookie(location);
  return createLocationObject(location);
};

/**
 * Get location by ID from locations.json
 * @param {number} locationId - Location ID
 * @returns {Object|null} Location object or null if not found
 */
export const getLocationById = (locationId) => {
  if (!locationId || !locations?.length) return null;

  const location = locations.find((loc) => loc.id === locationId);
  return location ? createLocationObject(location) : null;
};

/**
 * Search locations by city or state name
 * @param {string} searchTerm - Search term
 * @returns {Array} Array of matching locations
 */
export const searchLocations = (searchTerm) => {
  if (!searchTerm || !locations?.length) return [];

  const term = searchTerm.toLowerCase().trim();

  return locations
    .filter((location) => {
      const cityMatch = location.city?.toLowerCase().includes(term);
      const stateMatch = location.state?.toLowerCase().includes(term);
      return cityMatch || stateMatch;
    })
    .map(createLocationObject)
    .filter(Boolean);
};

/**
 * Legacy compatibility functions
 */

// Convert string to URL-friendly slug
export const toSlug = (string) => {
  return string.split(" ").join("-").toLowerCase();
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

// Maintain compatibility with existing getUserLocation.js functions
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

export const matchesCity = (city) => {
  let hasCity = false;
  locations.forEach((location) => {
    if (location.city === city) hasCity = true;
  });

  return hasCity;
};

// Enhanced version of UserLocationService using IP-based detection
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

    if (id) {
      const locationObj = locations.find((loc) => loc.id === id);
      return createLocationObject(locationObj);
    }

    return null;
  } catch (error) {
    console.error("IP-based location service failed:", error);
    throw error;
  }
};
