import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import styles from "./OtherLocations.module.scss";
import locationsData from "../../utils/locations.json";
import { AppContext } from "../../features/AppContext";

interface OtherLocationsProps {
  currentLocationId?: number;
  userId?: string;
}

interface Location {
  id: number;
  city: string | null;
  state: string;
  stateCode: string;
}

interface SavedLocation {
  id: number;
  city: string;
  state: string;
  slug: string;
}

const OtherLocations: React.FC<OtherLocationsProps> = ({
  currentLocationId,
  userId,
}) => {
  const { supabase } = useContext(AppContext);
  const [savedLocationIds, setSavedLocationIds] = useState<number[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllLocations, setShowAllLocations] = useState(false);

  // Filter only cities (where city isn't null)
  const cityLocations = locationsData.filter((loc) => loc.city !== null);

  // Get popular cities (you could customize this logic based on your preference)
  const popularCities = cityLocations.slice(0, 10);

  // Format a location for display and linking
  const formatLocation = (location: Location): SavedLocation => {
    return {
      id: location.id,
      city: location.city || "",
      state: location.state,
      slug: `events/${location.city?.toLowerCase().replace(/\s+/g, "-")}`,
    };
  };

  useEffect(() => {
    if (userId) {
      fetchSavedLocations();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Fetch user's saved locations from profile
  const fetchSavedLocations = async () => {
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

        // Map location IDs to full location data
        const locationObjects = data.other_locations
          .map((locId: number) => {
            const location = locationsData.find((loc) => loc.id === locId);
            return location ? formatLocation(location) : null;
          })
          .filter(Boolean); // Remove any null values

        setSavedLocations(locationObjects);
      }
    } catch (error) {
      console.error("Error fetching saved locations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a location to saved locations
  const addLocation = async (locationId: number) => {
    if (
      !userId ||
      savedLocationIds.includes(locationId) ||
      locationId === currentLocationId
    ) {
      return; // Don't add if already saved or is current location
    }

    try {
      const newSavedLocations = [...savedLocationIds, locationId];

      const { error } = await supabase
        .from("profiles")
        .update({ other_locations: newSavedLocations })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      // Update local state
      setSavedLocationIds(newSavedLocations);

      // Add the location object to our saved locations list
      const location = locationsData.find((loc) => loc.id === locationId);
      if (location) {
        setSavedLocations([...savedLocations, formatLocation(location)]);
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
      setSavedLocations(savedLocations.filter((loc) => loc.id !== locationId));
    } catch (error) {
      console.error("Error removing location:", error);
    }
  };

  return (
    <div className={styles.otherLocationsContainer}>
      <h3 className={styles.sectionTitle}>Other Locations</h3>

      {/* User's saved locations */}
      {savedLocations.length > 0 && (
        <div className={styles.savedLocationsSection}>
          <h4 className={styles.subsectionTitle}>Your Saved Locations</h4>
          <div className={styles.locationsList}>
            {savedLocations.map((location) => (
              <div key={location.id} className={styles.locationItem}>
                <Link
                  href={`/${location.slug}`}
                  className={styles.locationLink}
                >
                  {location.city}, {location.state}
                </Link>
                <button
                  onClick={() => removeLocation(location.id)}
                  className={styles.removeButton}
                  aria-label={`Remove ${location.city}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new locations section */}
      <div className={styles.addLocationsSection}>
        <h4 className={styles.subsectionTitle}>
          Add Locations
          <button
            onClick={() => setShowAllLocations(!showAllLocations)}
            className={styles.toggleButton}
          >
            {showAllLocations ? "Show Less" : "Show More"}
          </button>
        </h4>

        <div className={styles.locationsList}>
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
                <div key={location.id} className={styles.locationItem}>
                  <span className={styles.locationName}>
                    {location.city}, {location.state}
                  </span>
                  <button
                    onClick={() => addLocation(location.id)}
                    className={styles.addButton}
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

      {loading && <p className={styles.loading}>Loading locations...</p>}
    </div>
  );
};

export default OtherLocations;
