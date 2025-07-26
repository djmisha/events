import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { FaMapMarkerAlt, FaMusic, FaCog } from "react-icons/fa";
import { AppContext } from "../../features/AppContext";
import FavoriteArtists from "./FavoriteArtists";
import ArtistSearch from "./ArtistSearch";
import OtherLocations from "./OtherLocations";
import Greeting from "./Greeting";
import EditProfile from "./EditProfile";
import LocationCard from "./LocationCard";
import locationsData from "../../utils/locations.json";

interface UserDashboardProps {
  user: User;
  profile?: any;
  defaultLocation?: any;
}

interface Location {
  id: number;
  city: string | null;
  state: string;
  stateCode: string;
  slug?: string;
}

interface FormattedLocation {
  id: number;
  city: string;
  state: string;
  stateCode: string;
  slug: string;
}

export default function UserDashboard({
  profile: serverProfile,
  defaultLocation,
}: UserDashboardProps) {
  const { profile: contextProfile, supabase } = useContext(AppContext);
  const [formattedLocation, setFormattedLocation] =
    useState<FormattedLocation | null>(null);
  const [refreshFavorites, setRefreshFavorites] = useState(0);
  const [userLocations, setUserLocations] = useState<FormattedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "location" | "artist" | "settings"
  >("location");

  // Use server provided profile or context profile (memoized to prevent unnecessary re-renders)
  const profile = useMemo(
    () => serverProfile || contextProfile,
    [serverProfile, contextProfile]
  );

  // Use server-side defaultLocation or find it client side (optimized dependencies)
  useEffect(() => {
    if (defaultLocation) {
      // Use the server provided location data
      const cityName = defaultLocation.city || defaultLocation.state;
      setFormattedLocation({
        id: defaultLocation.id,
        city: cityName,
        state: defaultLocation.state,
        stateCode: defaultLocation.stateCode,
        slug: `events/${cityName.toLowerCase().replace(/\s+/g, "-")}`,
      });
    } else if (profile?.default_city) {
      // Fall back to client-side location finding
      const locationId =
        typeof profile.default_city === "object"
          ? profile.default_city.id
          : Number(profile.default_city);

      const findLocation = () => {
        const location = locationsData.find((loc) => loc.id === locationId);

        if (location) {
          // Format the location data
          const cityName = location.city || location.state;
          setFormattedLocation({
            id: location.id,
            city: cityName,
            state: location.state,
            stateCode: location.stateCode,
            slug: `events/${cityName.toLowerCase().replace(/\s+/g, "-")}`,
          });
        } else {
          console.log("Location not found for ID:", locationId);
        }
      };

      findLocation();
    }
  }, [defaultLocation, profile?.default_city]); // Include defaultLocation but be specific about profile

  // Fetch user's saved locations (optimized with memoized dependency)
  const formattedLocationId = formattedLocation?.id;

  useEffect(() => {
    const fetchUserLocations = async () => {
      if (!profile?.id || !supabase) return;

      setLoading(true);
      try {
        // Get user's saved location IDs
        const { data: savedLocationIds } = await supabase
          .from("profiles")
          .select("other_locations")
          .eq("id", profile.id)
          .single();

        const otherLocationIds = savedLocationIds?.other_locations || [];

        // Combine default location with other locations
        const allLocationIds = formattedLocationId
          ? [
              formattedLocationId,
              ...otherLocationIds.filter(
                (id: number) => id !== formattedLocationId
              ),
            ]
          : otherLocationIds;

        // Format all locations
        const locations = allLocationIds
          .map((locationId: number) => {
            const location = locationsData.find((loc) => loc.id === locationId);
            if (location) {
              const cityName = location.city || location.state;
              return {
                id: location.id,
                city: cityName,
                state: location.state,
                stateCode: location.stateCode,
                slug: `events/${cityName.toLowerCase().replace(/\s+/g, "-")}`,
              };
            }
            return null;
          })
          .filter(Boolean) as FormattedLocation[];

        setUserLocations(locations);
      } catch (error) {
        console.error("Error fetching user locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLocations();
  }, [profile?.id, formattedLocationId, supabase]);

  // Memoize functions to prevent unnecessary re-renders
  const handleRemoveLocation = useCallback(
    async (locationId: number) => {
      if (!profile?.id || !supabase) return;

      try {
        // If removing default location, we need to update the default_location_id
        if (formattedLocation?.id === locationId) {
          // Find another location to set as default, or set to null
          const remainingLocations = userLocations.filter(
            (loc) => loc.id !== locationId
          );
          const newDefaultId =
            remainingLocations.length > 0 ? remainingLocations[0].id : null;

          await supabase
            .from("profiles")
            .update({ default_location_id: newDefaultId })
            .eq("id", profile.id);

          setFormattedLocation(
            remainingLocations.length > 0 ? remainingLocations[0] : null
          );
        } else {
          // Remove from other_locations array
          const currentOtherLocations = userLocations
            .filter(
              (loc) => loc.id !== formattedLocation?.id && loc.id !== locationId
            )
            .map((loc) => loc.id);

          await supabase
            .from("profiles")
            .update({ other_locations: currentOtherLocations })
            .eq("id", profile.id);
        }

        // Update local state
        setUserLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      } catch (error) {
        console.error("Error removing location:", error);
      }
    },
    [profile?.id, supabase, formattedLocation?.id, userLocations]
  );

  const handleLocationAdded = useCallback(async () => {
    // Refresh the user locations
    if (!profile?.id || !supabase) return;

    try {
      // Get user's saved location IDs
      const { data: savedLocationIds } = await supabase
        .from("profiles")
        .select("other_locations")
        .eq("id", profile.id)
        .single();

      const otherLocationIds = savedLocationIds?.other_locations || [];

      // Combine default location with other locations
      const allLocationIds = formattedLocation
        ? [
            formattedLocation.id,
            ...otherLocationIds.filter(
              (id: number) => id !== formattedLocation.id
            ),
          ]
        : otherLocationIds;

      // Format all locations
      const locations = allLocationIds
        .map((locationId: number) => {
          const location = locationsData.find((loc) => loc.id === locationId);
          if (location) {
            const cityName = location.city || location.state;
            return {
              id: location.id,
              city: cityName,
              state: location.state,
              stateCode: location.stateCode,
              slug: `events/${cityName.toLowerCase().replace(/\s+/g, "-")}`,
            };
          }
          return null;
        })
        .filter(Boolean) as FormattedLocation[];

      setUserLocations(locations);
    } catch (error) {
      console.error("Error refreshing user locations:", error);
    }
  }, [profile?.id, supabase, formattedLocation]);

  const handleArtistToggled = useCallback(() => {
    // Trigger a refresh of the FavoriteArtists component
    setRefreshFavorites((prev) => prev + 1);
  }, []);

  // Memoize saved location IDs to prevent unnecessary recalculations
  const savedLocationIds = useMemo(() => {
    return userLocations.map((loc) => loc.id);
  }, [userLocations]);

  // Debug log - only runs when profile actually changes (not on every render)
  useEffect(() => {
    if (profile?.id) {
      console.log(
        "UserDashboard profile changed:",
        profile.id,
        profile.username
      );
    }
  }, [profile?.id, profile?.username]);

  return (
    <div className="max-w-7xl mx-auto my-8 px-2 pb-20">
      {/* Tab Content */}
      <div className="mt-5">
        {/* Location Tab */}
        {activeTab === "location" && (
          <div className="animate-[fadeIn_0.3s_ease]">
            {profile && (
              <Greeting username={profile.username} email={profile.email} />
            )}

            {/* Your Locations section */}
            <div className="mb-8">
              <h2 className="mb-4 text-gray-800 text-2xl">Your Locations</h2>
              {loading ? (
                <p>Loading your locations...</p>
              ) : userLocations.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {userLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      id={location.id}
                      city={location.city}
                      state={location.state}
                      stateCode={location.stateCode}
                      slug={location.slug}
                      isDefault={location.id === formattedLocation?.id}
                      onRemove={handleRemoveLocation}
                    />
                  ))}
                </div>
              ) : (
                <p>
                  No locations saved yet. Add locations to see events in your
                  area.
                </p>
              )}
            </div>

            {/* Keep the OtherLocations component for adding new locations */}
            <OtherLocations
              currentLocationId={formattedLocation?.id}
              userId={profile?.id}
              savedLocationIds={savedLocationIds}
              onLocationAdded={handleLocationAdded}
            />
          </div>
        )}

        {/* Artist Tab */}
        {activeTab === "artist" && (
          <div className="animate-[fadeIn_0.3s_ease]">
            {/* Artist Management Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                {profile && (
                  <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] h-full">
                    <FavoriteArtists
                      userId={profile.id}
                      key={`favorites-${refreshFavorites}`}
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0 mt-6 md:mt-0">
                {profile && (
                  <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] h-full">
                    <ArtistSearch
                      userId={profile.id}
                      onArtistAdded={handleArtistToggled}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings/Quick Access Tab */}
        {activeTab === "settings" && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <EditProfile user={profile} />
          </div>
        )}
      </div>

      {/* Fixed Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex bg-white border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[1000] pb-[env(safe-area-inset-bottom)]">
        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 pb-3 bg-transparent border-none text-xs cursor-pointer transition-all duration-300 ease-[ease] text-gray-600 relative min-h-[60px] hover:bg-gray-50 md:min-h-[70px] md:py-1.5 md:pb-2.5 ${
            activeTab === "location"
              ? "text-blue-500 before:content-[''] before:absolute before:top-1.5 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-blue-500 before:rounded-full [&>.tabIcon]:scale-110 [&>.tabLabel]:font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("location")}
        >
          <FaMapMarkerAlt className="tabIcon w-6 h-6 mb-1 transition-all duration-300 ease-[ease] md:w-5 md:h-5 max-[480px]:w-[18px] max-[480px]:h-[18px] max-[360px]:mb-0" />
          <span className="tabLabel font-medium whitespace-nowrap text-[11px] md:text-[10px] max-[480px]:text-[9px] max-[360px]:hidden">
            Locations
          </span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 pb-3 bg-transparent border-none text-xs cursor-pointer transition-all duration-300 ease-[ease] text-gray-600 relative min-h-[60px] hover:bg-gray-50 md:min-h-[70px] md:py-1.5 md:pb-2.5 ${
            activeTab === "artist"
              ? "text-blue-500 before:content-[''] before:absolute before:top-1.5 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-blue-500 before:rounded-full [&>.tabIcon]:scale-110 [&>.tabLabel]:font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("artist")}
        >
          <FaMusic className="tabIcon w-6 h-6 mb-1 transition-all duration-300 ease-[ease] md:w-5 md:h-5 max-[480px]:w-[18px] max-[480px]:h-[18px] max-[360px]:mb-0" />
          <span className="tabLabel font-medium whitespace-nowrap text-[11px] md:text-[10px] max-[480px]:text-[9px] max-[360px]:hidden">
            Artists
          </span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 pb-3 bg-transparent border-none text-xs cursor-pointer transition-all duration-300 ease-[ease] text-gray-600 relative min-h-[60px] hover:bg-gray-50 md:min-h-[70px] md:py-1.5 md:pb-2.5 ${
            activeTab === "settings"
              ? "text-blue-500 before:content-[''] before:absolute before:top-1.5 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-blue-500 before:rounded-full [&>.tabIcon]:scale-110 [&>.tabLabel]:font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <FaCog className="tabIcon w-6 h-6 mb-1 transition-all duration-300 ease-[ease] md:w-5 md:h-5 max-[480px]:w-[18px] max-[480px]:h-[18px] max-[360px]:mb-0" />
          <span className="tabLabel font-medium whitespace-nowrap text-[11px] md:text-[10px] max-[480px]:text-[9px] max-[360px]:hidden">
            Settings
          </span>
        </button>
      </div>
    </div>
  );
}
