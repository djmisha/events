// Enhanced geolocation service using new location system
import { detectUserLocation, UserLocationService } from "./locationService.js";

/**
 * Enhanced geolocation function that detects user location
 * with fallback to IP-based detection
 * @returns {Promise<Object|null>} Location object or null
 */
const setGeolocation = async () => {
  try {
    // Try browser geolocation first
    const location = await detectUserLocation();
    return location;
  } catch (geolocationError) {
    console.warn(
      "Browser geolocation failed, trying IP-based detection:",
      geolocationError.message
    );

    try {
      // Fallback to IP-based location
      const fallbackLocation = await UserLocationService();
      return fallbackLocation;
    } catch (fallbackError) {
      console.error(
        "All location detection methods failed:",
        fallbackError.message
      );
      return null;
    }
  }
};

export default setGeolocation;
