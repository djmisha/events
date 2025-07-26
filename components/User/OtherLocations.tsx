import React, { useEffect, useState, useContext } from "react";
import locationsData from "../../utils/locations.json";
import { AppContext } from "../../features/AppContext";

interface OtherLocationsProps {
  currentLocationId?: number;
  userId?: string;
  savedLocationIds?: number[];
  onLocationAdded?: () => Promise<void> | void;
}

interface Location {
  id: number;
  city: string | null;
  state: string;
  stateCode: string;
}

const OtherLocations: React.FC<OtherLocationsProps> = ({
  currentLocationId,
  userId,
  savedLocationIds: propSavedLocationIds,
  onLocationAdded,
}) => {
  const { supabase } = useContext(AppContext);
  const [savedLocationIds, setSavedLocationIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllLocations, setShowAllLocations] = useState(false);

  // Filter only cities (where city isn't null) and sort alphabetically by city name
  const cityLocations = locationsData
    .filter((loc) => loc.city !== null)
    .sort((a, b) => (a.city || "").localeCompare(b.city || ""));

  // Get popular cities (first 10 from alphabetically sorted list)
  const popularCities = cityLocations.slice(0, 10);

  useEffect(() => {
    // If savedLocationIds are provided as props, use them directly
    if (propSavedLocationIds) {
      setSavedLocationIds(propSavedLocationIds);
      setLoading(false);
      return;
    }

    // Otherwise, fetch them from the database
    const fetchSavedLocationIds = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("other_locations")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        if (data && data.other_locations) {
          setSavedLocationIds(data.other_locations);
        }
      } catch (error) {
        console.error("Error fetching saved location IDs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedLocationIds();
  }, [userId, supabase, propSavedLocationIds]);

  // Add a location to saved locations
  const addLocation = async (locationId: number) => {
    // Use the current savedLocationIds state which is now kept in sync
    const currentSavedIds = savedLocationIds;

    if (
      !userId ||
      currentSavedIds.includes(locationId) ||
      locationId === currentLocationId
    ) {
      return; // Don't add if already saved or is current location
    }

    try {
      const newSavedLocations = [...currentSavedIds, locationId];

      const { error } = await supabase
        .from("profiles")
        .update({ other_locations: newSavedLocations })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      // Update local state
      setSavedLocationIds(newSavedLocations);

      // Call the callback to refresh the parent component
      if (onLocationAdded) {
        await onLocationAdded();
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  // Remove a location from saved locations
  const removeLocation = async (locationId: number) => {
    if (!userId) return;

    try {
      const newSavedLocations = savedLocationIds.filter(
        (id) => id !== locationId
      );

      const { error } = await supabase
        .from("profiles")
        .update({ other_locations: newSavedLocations })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      // Update local state
      setSavedLocationIds(newSavedLocations);
    } catch (error) {
      console.error("Error removing location:", error);
    }
  };

  return (
    <div className="mt-6 rounded-lg">
      {/* Add new locations section */}
      <div className="mt-4">
        <h4 className="text-base my-4 mb-2 font-medium text-gray-600 flex justify-between items-center">
          Add Locations
          <button
            onClick={() => setShowAllLocations(!showAllLocations)}
            className="bg-transparent border-none text-blue-600 cursor-pointer text-[0.85rem] hover:underline"
          >
            {showAllLocations ? "Show Less" : "Show More"}
          </button>
        </h4>

        <div className="flex flex-wrap gap-3 mt-2">
          {(showAllLocations ? cityLocations : popularCities).map(
            (location) => {
              // Skip if this is already the current location or in saved locations
              if (
                location.id === currentLocationId ||
                savedLocationIds.includes(location.id) ||
                !location.city
              ) {
                return null;
              }

              return (
                <div
                  key={location.id}
                  className="bg-white py-2 px-3 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-between gap-2"
                >
                  <span className="text-gray-800">{location.city}</span>
                  <button
                    onClick={() => addLocation(location.id)}
                    className="bg-transparent border-none cursor-pointer text-base flex items-center justify-center w-6 h-6 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-200"
                    aria-label={`Add ${location.city}`}
                  >
                    +
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>

      {loading && (
        <p className="text-gray-500 italic mt-2">Loading locations...</p>
      )}
    </div>
  );
};

export default OtherLocations;
