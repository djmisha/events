import { useContext } from "react";
import { AppContext } from "../../features/AppContext";

export default function WelcomeMessage() {
  const { currentUserLocation } = useContext(AppContext);

  // Hide the message if user has a location set
  if (currentUserLocation) {
    return null;
  }

  return (
    <div className="bg-white text-black p-6 text-center rounded-lg shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold pb-3 text-gray-800">
        Welcome to Our Dance Music Community!
      </h2>
      <div className="space-y-3 text-gray-700">
        <p className="text-lg">
          Discover top artists, explore exciting locations, and immerse yourself
          in vibrant dance music scenes around the world.
        </p>
        <p className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 mx-auto max-w-md">
          💡 <strong>Tip:</strong> Enable location services or search for your
          city to see personalized events and venues near you!
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm text-gray-600">
          <span>🎵 Browse events by city</span>
          <span className="hidden sm:inline">•</span>
          <span>🎯 Search for your favorite artists</span>
          <span className="hidden sm:inline">•</span>
          <span>📍 Discover new venues</span>
        </div>
        <p className="text-base font-medium text-gray-800 pt-2">
          Start your dance music adventure today!
        </p>
      </div>
    </div>
  );
}
