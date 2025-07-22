import React, { useState, useEffect } from "react";
import Link from "next/link";
import ShareLocation from "../ShareLocation/ShareLocation";
import {
  getSavedLocation,
  getLocationEventsUrl,
} from "../../utils/locationService";
import styles from "./QuickLocationFinder.module.scss";

const QuickLocationFinder = ({ className = "" }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasLocationCookie, setHasLocationCookie] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved location on mount
  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      setHasLocationCookie(true);
    } else {
      setHasLocationCookie(false);
    }
    setIsLoading(false);
  }, []);

  const handleLocationDetected = (location) => {
    setCurrentLocation(location);
    setHasLocationCookie(true);
  };

  const handleLocationError = (error) => {
    console.error("Location detection error:", error);
    // Keep showing the share button on error
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

  const getEventsUrl = () => {
    if (!currentLocation) return "#";
    return getLocationEventsUrl(currentLocation);
  };

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Don't show anything if user has a cookie (location is set)
  if (hasLocationCookie && currentLocation) {
    return (
      <div className={`${styles.quickLocationFinder} ${className}`}>
        <div className={styles.locationFound}>
          <div className={styles.locationIcon}>📍</div>
          <div className={styles.locationInfo}>
            <h3 className={styles.locationTitle}>Your Location</h3>
            <p className={styles.locationName}>
              {formatLocationDisplay(currentLocation)}
            </p>
            <Link href={getEventsUrl()} className={styles.viewEventsButton}>
              View Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show the "We can find your location" prompt for first-time users
  return (
    <div className={`${styles.quickLocationFinder} ${className}`}>
      <div className={styles.findLocationPrompt}>
        <div className={styles.promptIcon}>🌍</div>
        <div className={styles.promptContent}>
          <h3 className={styles.promptTitle}>We can find your location</h3>
          <p className={styles.promptDescription}>
            Let us detect your location to show you nearby events
          </p>
          <ShareLocation
            onLocationDetected={handleLocationDetected}
            onLocationError={handleLocationError}
            buttonText="Find My Location"
            className={styles.shareLocationButton}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickLocationFinder;
