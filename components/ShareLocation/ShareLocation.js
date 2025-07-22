import React, { useState, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import {
  detectUserLocation,
  saveLocationToCookie,
  UserLocationService,
} from "../../utils/locationService";
import styles from "./ShareLocation.module.scss";

const ShareLocation = ({
  onLocationDetected,
  onLocationError,
  className = "",
  disabled = false,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addLocation } = useContext(AppContext);

  const handleShareLocation = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Try browser geolocation first
      const location = await detectUserLocation();

      if (location) {
        // Save to cookie
        saveLocationToCookie(location);

        // Add to context
        addLocation(location);

        // Notify parent component
        if (onLocationDetected) {
          onLocationDetected(location);
        }
      } else {
        throw new Error("Unable to determine location from coordinates");
      }
    } catch (geolocationError) {
      console.warn(
        "Geolocation failed, trying IP-based detection:",
        geolocationError.message
      );

      try {
        // Fallback to IP-based location detection
        const fallbackLocation = await UserLocationService();

        if (fallbackLocation) {
          // Save to cookie
          saveLocationToCookie(fallbackLocation);

          // Add to context
          addLocation(fallbackLocation);

          // Notify parent component
          if (onLocationDetected) {
            onLocationDetected(fallbackLocation);
          }
        } else {
          throw new Error("Unable to detect location using IP service");
        }
      } catch (fallbackError) {
        const errorMessage =
          "Unable to detect your location. Please try again or select a location manually.";
        setError(errorMessage);

        if (onLocationError) {
          onLocationError(new Error(errorMessage));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.shareLocation} ${className}`}>
      <button
        type="button"
        onClick={handleShareLocation}
        disabled={disabled || isLoading}
        className={`${styles.shareButton} ${isLoading ? styles.loading : ""}`}
        aria-label={isLoading ? "Detecting location..." : "Share my location"}
      >
        {isLoading ? (
          <span className={styles.loadingContent}>
            <span className={styles.spinner}></span>
            Detecting location...
          </span>
        ) : (
          children || "Share My Location"
        )}
      </button>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default ShareLocation;
