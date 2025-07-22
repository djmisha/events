import { useContext } from "react";
import { AppContext } from "../features/AppContext";
import {
  getLocationEventsUrl,
  getLocationSlug,
  hasValidLocationUrl,
} from "../utils/locationService";

/**
 * Custom hook for accessing location functionality from AppContext
 * @returns {Object} Location context and methods
 */
export const useLocation = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useLocation must be used within an AppProvider");
  }

  const {
    currentUserLocation,
    locationCtx,
    setUserLocation,
    clearUserLocation,
    addLocation,
  } = context;

  return {
    // Current user's selected location
    currentLocation: currentUserLocation,

    // All locations that have been added to context
    allLocations: locationCtx,

    // Methods for managing user location
    setLocation: setUserLocation,
    clearLocation: clearUserLocation,
    addLocationToContext: addLocation,

    // Convenience methods
    hasLocation: !!currentUserLocation,
    locationId: currentUserLocation?.id || null,
    locationName: currentUserLocation
      ? currentUserLocation.city && currentUserLocation.state
        ? `${currentUserLocation.city}, ${currentUserLocation.state}`
        : currentUserLocation.state || currentUserLocation.city || ""
      : null,

    // URL generation methods
    locationEventsUrl: getLocationEventsUrl(currentUserLocation),
    locationSlug: getLocationSlug(currentUserLocation),
    hasValidUrl: hasValidLocationUrl(currentUserLocation),
  };
};

export default useLocation;
