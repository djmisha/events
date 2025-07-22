import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../../features/AppContext";
import {
  updateUserLocation,
  getLocationById,
  searchLocations,
  getSavedLocation,
} from "../../utils/locationService";
import styles from "./LocationSwitch.module.scss";

const LocationSwitch = ({
  onLocationChanged,
  className = "",
  placeholder = "Search for a city or state...",
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const searchInputRef = useRef(null);
  const { addLocation } = useContext(AppContext);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = getSavedLocation();
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    }
  }, []);

  // Handle window resize and scroll to update dropdown position
  useEffect(() => {
    const handleWindowEvents = () => {
      if (showDropdown) {
        calculateDropdownPosition();
      }
    };

    if (showDropdown) {
      window.addEventListener("scroll", handleWindowEvents, true);
      window.addEventListener("resize", handleWindowEvents);

      return () => {
        window.removeEventListener("scroll", handleWindowEvents, true);
        window.removeEventListener("resize", handleWindowEvents);
      };
    }
  }, [showDropdown]);

  // Handle search input changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsSearching(true);
      const results = searchLocations(searchTerm);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
      calculateDropdownPosition();
      setShowDropdown(true);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  // Calculate dropdown position for fixed positioning
  const calculateDropdownPosition = () => {
    if (searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      setDropdownPosition({
        top: rect.bottom + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
      });
    }
  };

  const handleLocationSelect = (location) => {
    if (!location) return;

    // Update the location
    const updatedLocation = updateUserLocation(location);

    if (updatedLocation) {
      setCurrentLocation(updatedLocation);
      addLocation(updatedLocation);

      // Clear search
      setSearchTerm("");
      setShowDropdown(false);
      setSearchResults([]);

      // Notify parent component
      if (onLocationChanged) {
        onLocationChanged(updatedLocation);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      calculateDropdownPosition();
      setShowDropdown(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
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

  const handleKeyDown = (e, location) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLocationSelect(location);
    }
  };

  return (
    <div className={`${styles.locationSwitch} ${className}`}>
      {/* {currentLocation && (
        <div className={styles.currentLocation}>
          <span className={styles.locationLabel}>Current Location:</span>
          <span className={styles.locationName}>
            {formatLocationDisplay(currentLocation)}
          </span>
        </div>
      )} */}

      <div className={styles.searchContainer}>
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search for location"
          aria-haspopup="listbox"
        />

        {isSearching && (
          <div className={styles.searchSpinner}>
            <span className={styles.spinner}></span>
          </div>
        )}

        {showDropdown && searchResults.length > 0 && (
          <div
            className={styles.dropdown}
            role="listbox"
            style={{
              position: "fixed",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 999999999,
            }}
          >
            {searchResults.map((location) => (
              <div
                key={location.id}
                className={styles.dropdownItem}
                onClick={() => handleLocationSelect(location)}
                onKeyDown={(e) => handleKeyDown(e, location)}
                role="option"
                tabIndex={0}
                aria-selected={currentLocation?.id === location.id}
              >
                <div className={styles.locationInfo}>
                  <div className={styles.locationText}>
                    {formatLocationDisplay(location)}
                  </div>
                  {location.country && (
                    <div className={styles.locationCountry}>
                      {location.country}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showDropdown &&
          searchTerm.length >= 2 &&
          searchResults.length === 0 &&
          !isSearching && (
            <div
              className={styles.dropdown}
              style={{
                position: "fixed",
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 999999999,
              }}
            >
              <div className={styles.noResults}>
                No locations found for &ldquo;{searchTerm}&rdquo;
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default LocationSwitch;
