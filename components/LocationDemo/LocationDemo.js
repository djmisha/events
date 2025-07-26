import React from "react";
import { useLocation } from "../../hooks/useLocation";
import LocationManager from "../LocationManager/LocationManager";

/**
 * Demo component showing how to use the location system
 * This can be used as a reference or directly in your application
 */
const LocationDemo = () => {
  const { currentLocation, hasLocation, locationName, locationId } =
    useLocation();

  const handleLocationChanged = (location) => {
    if (location) {
      console.log("Location changed to:", location);
    } else {
      console.log("Location cleared");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <div className="mb-8 p-6 bg-gray-100 rounded-lg border border-gray-300">
        <h2 className="m-0 mb-4 text-gray-800 text-2xl font-semibold">
          Location System Demo
        </h2>
        <p className="m-0 text-gray-600 leading-relaxed">
          This demo shows how the location system works in your application.
        </p>
      </div>

      <div className="mb-8 p-6 bg-gray-100 rounded-lg border border-gray-300">
        <h3 className="m-0 mb-4 text-gray-700 text-xl font-semibold">
          Current Location Status
        </h3>
        {hasLocation ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <strong>Location Name:</strong> {locationName}
            </div>
            <div className="flex items-center gap-2">
              <strong>Location ID:</strong> {locationId}
            </div>
            <div>
              <strong>Full Location Object:</strong>
              <pre className="bg-gray-100 border border-gray-400 rounded-md p-4 font-mono text-sm leading-relaxed text-gray-700 overflow-x-auto whitespace-pre mt-2">
                {JSON.stringify(currentLocation, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-md text-yellow-800 text-center italic">
            No location set. Use the location manager below to set one.
          </div>
        )}
      </div>

      <div className="mb-8 p-6 bg-gray-100 rounded-lg border border-gray-300">
        <LocationManager
          onLocationChanged={handleLocationChanged}
          title="Location Manager"
          showCurrentLocation={true}
          showShareButton={true}
          showLocationSwitch={true}
        />
      </div>

      <div className="mb-8 p-6 bg-gray-100 rounded-lg border border-gray-300">
        <h3 className="m-0 mb-4 text-gray-700 text-xl font-semibold">
          How It Works
        </h3>
        <div className="bg-white p-6 rounded-md border border-gray-300">
          <ol className="m-0 pl-6 text-gray-700 leading-relaxed [&_li]:mb-3 [&_li:last-child]:mb-0">
            <li>
              <strong>Share Location:</strong> Click &ldquo;Share My
              Location&rdquo; to use browser geolocation
            </li>
            <li>
              <strong>Search Location:</strong> Type in the search box to find
              cities or states
            </li>
            <li>
              <strong>Persistent Storage:</strong> Your location is saved in a
              cookie and remembered
            </li>
            <li>
              <strong>Context Access:</strong> Location data is available
              throughout the app via useLocation hook
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LocationDemo;
