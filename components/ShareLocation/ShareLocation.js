import React, { useState, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import Button from "../Button/Button";
import {
  detectUserLocation,
  saveLocationToCookie,
  UserLocationService,
} from "../../utils/locationService";

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
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <Button
        type="button"
        onClick={handleShareLocation}
        disabled={disabled || isLoading}
        size="lg"
        color={isLoading ? "gray" : "blue"}
        className="w-full flex items-center justify-center"
        aria-label={isLoading ? "Detecting location..." : "Share my location"}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Detecting location...
          </span>
        ) : (
          children || "Share My Location"
        )}
      </Button>

      {error && (
        <div
          className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded border-l-4 border-red-400 max-w-sm md:text-xs md:max-w-72"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ShareLocation;
