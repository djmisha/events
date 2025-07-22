import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../features/AppContext";
import ShareLocation from "../ShareLocation/ShareLocation";
import LocationSwitch from "../LocationSwitch/LocationSwitch";
import {
  getSavedLocation,
  updateUserLocation,
  getLocationEventsUrl,
  hasValidLocationUrl,
} from "../../utils/locationService";
import styles from "./LocationManager.module.scss";

const LocationManager = ({
  onLocationChanged,
  showCurrentLocation = true,
  showShareButton = true,
  showLocationSwitch = true,
  className = "",
  title = "Location Settings",
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addLocation } = useContext(AppContext);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      addLocation(savedLocation);

      if (onLocationChanged) {
        onLocationChanged(savedLocation);
      }
    }
  }, [addLocation, onLocationChanged]);

  const handleLocationDetected = (location) => {
    setCurrentLocation(location);
    setHasError(false);
    setErrorMessage("");

    if (onLocationChanged) {
      onLocationChanged(location);
    }
  };

  const handleLocationError = (error) => {
    setHasError(true);
    setErrorMessage(error.message);
  };

  const handleLocationChanged = (location) => {
    setCurrentLocation(location);
    setHasError(false);
    setErrorMessage("");

    if (onLocationChanged) {
      onLocationChanged(location);
    }
  };

  const handleClearLocation = () => {
    setCurrentLocation(null);
    updateUserLocation(null);
    setHasError(false);
    setErrorMessage("");

    if (onLocationChanged) {
      onLocationChanged(null);
    }
  };

  const formatLocationDisplay = (location) => {
    if (!location) return "";

    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    } else if (location.state) {
      return location.state;
    }
    return location.city || "";
  };

  return (
    <div className={`${styles.locationManager} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}

      {showCurrentLocation && currentLocation && (
        <div className={styles.currentLocationSection}>
          <div className={styles.locationInfo}>
            <span className={styles.label}>Current Location:</span>
            <div className={styles.locationDetails}>
              <span className={styles.location}>
                {formatLocationDisplay(currentLocation)}
              </span>
              {hasValidLocationUrl(currentLocation) && (
                <a
                  href={getLocationEventsUrl(currentLocation)}
                  className={styles.viewEventsLink}
                >
                  View Events
                </a>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearLocation}
            className={styles.clearButton}
            aria-label="Clear current location"
          >
            ✕
          </button>
        </div>
      )}

      {hasError && (
        <div className={styles.error} role="alert">
          {errorMessage}
        </div>
      )}

      <div className={styles.actions}>
        {showLocationSwitch && (
          <div className={styles.actionSection}>
            <div className={styles.sectionLabel}>Search for a location:</div>
            <LocationSwitch
              onLocationChanged={handleLocationChanged}
              placeholder="Search cities or states..."
            />
          </div>
        )}

        {showShareButton && (
          <div className={styles.actionSection}>
            <ShareLocation
              onLocationDetected={handleLocationDetected}
              onLocationError={handleLocationError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationManager;
