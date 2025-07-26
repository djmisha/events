import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../../features/AppContext";
import {
  updateUserLocation,
  getLocationById,
  searchLocations,
  getSavedLocation,
} from "../../utils/locationService";

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
    <div className={`flex flex-col gap-4 max-w-sm md:max-w-full ${className}`}>
      {/* {currentLocation && (
        <div className="flex flex-col gap-1 p-3 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">Current Location:</span>
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {formatLocationDisplay(currentLocation)}
          </span>
        </div>
      )} */}

      <div className="relative flex flex-col">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder={placeholder}
          className="w-full p-3 pr-10 text-base border-2 border-gray-300 rounded-lg outline-none transition-colors duration-200 placeholder-gray-500 text-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-900/50"
          aria-label="Search for location"
          aria-haspopup="listbox"
        />

        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="inline-block w-4 h-4 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin"></span>
          </div>
        )}

        {showDropdown && searchResults.length > 0 && (
          <div
            className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto md:max-h-36 dark:bg-gray-600 dark:border-gray-500"
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
                className="p-3 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none aria-selected:bg-blue-100 aria-selected:text-blue-800 dark:border-gray-500 dark:hover:bg-gray-500 dark:focus:bg-gray-500 dark:aria-selected:bg-blue-600 dark:aria-selected:text-white"
                onClick={() => handleLocationSelect(location)}
                onKeyDown={(e) => handleKeyDown(e, location)}
                role="option"
                tabIndex={0}
                aria-selected={currentLocation?.id === location.id}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {formatLocationDisplay(location)}
                  </div>
                  {location.country && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
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
              className="bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-600 dark:border-gray-500"
              style={{
                position: "fixed",
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 999999999,
              }}
            >
              <div className="p-3 text-center text-gray-500 italic dark:text-gray-400">
                No locations found for &ldquo;{searchTerm}&rdquo;
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default LocationSwitch;
