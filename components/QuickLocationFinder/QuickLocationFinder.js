import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import {
  getSavedLocation,
  getLocationEventsUrl,
  detectUserLocation,
} from "../../utils/locationService";

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

  if (isLoading) {
    return null;
  }

  const handleButtonClick = async () => {
    if (hasLocationCookie && currentLocation) {
      window.location.href = getEventsUrl();
    } else {
      try {
        const location = await detectUserLocation();
        if (location) {
          setCurrentLocation(location);
          setHasLocationCookie(true);
        } else {
          alert(
            "Unable to detect your location. Please try again or select manually."
          );
        }
      } catch (error) {
        alert(
          "Unable to detect your location. Please try again or select manually."
        );
      }
    }
  };

  const buttonText =
    hasLocationCookie && currentLocation
      ? `View events in ${formatLocationDisplay(currentLocation)}`
      : "Share your location";

  return (
    <div className={`max-w-lg mx-auto my-8 px-4 ${className}`}>
      <Button onClick={handleButtonClick} color="blue" size="lg">
        {buttonText}
      </Button>
    </div>
  );
};

export default QuickLocationFinder;
