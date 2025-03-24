import { useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import styles from "./UserDashboard.module.scss";
import { AppContext } from "../../features/AppContext";
import FavoriteArtists from "./FavoriteArtists";
import ArtistSearch from "./ArtistSearch";
import OtherLocations from "./OtherLocations";
import Greeting from "./Greeting";
import EditProfile from "./EditProfile";
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
  slug: string;
}

export default function UserDashboard({
  profile: serverProfile,
  defaultLocation,
}: UserDashboardProps) {
  const { profile: contextProfile } = useContext(AppContext);
  const [formattedLocation, setFormattedLocation] =
    useState<FormattedLocation | null>(null);
  const [refreshFavorites, setRefreshFavorites] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "location" | "artist" | "settings"
  >("location");

  // Use server provided profile or context profile
  const profile = serverProfile || contextProfile;

  // Use server-side defaultLocation or find it client side
  useEffect(() => {
    if (defaultLocation) {
      // Use the server provided location data
      const cityName = defaultLocation.city || defaultLocation.state;
      setFormattedLocation({
        id: defaultLocation.id,
        city: cityName,
        state: defaultLocation.state,
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
            slug: `events/${cityName.toLowerCase().replace(/\s+/g, "-")}`,
          });
        } else {
          console.log("Location not found for ID:", locationId);
        }
      };

      findLocation();
    }
  }, [profile, defaultLocation]);

  // Callback for when an artist is added or removed
  const handleArtistToggled = () => {
    // Trigger a refresh of the FavoriteArtists component
    setRefreshFavorites((prev) => prev + 1);
  };

  console.log("UserDashboard profile:", profile);

  return (
    <div className={styles.dashboardContainer}>
      {profile && (
        <Greeting username={profile.username} email={profile.email} />
      )}

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "location" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("location")}
        >
          Locations
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "artist" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("artist")}
        >
          Artists
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "settings" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Location Tab */}
        {activeTab === "location" && (
          <div className={styles.locationTab}>
            {/* Default city section */}
            {formattedLocation && (
              <div className={styles.defaultCitySection}>
                <h2>Your Default City</h2>
                <div className={styles.cityInfo}>
                  <p>
                    {formattedLocation.city}, {formattedLocation.state}
                  </p>
                  <Link
                    href={`/${formattedLocation.slug}`}
                    className={styles.viewEventsLink}
                  >
                    View Events
                  </Link>
                </div>
              </div>
            )}

            {/* Other Locations section */}
            <OtherLocations
              currentLocationId={formattedLocation?.id}
              userId={profile?.id}
            />
          </div>
        )}

        {/* Artist Tab */}
        {activeTab === "artist" && (
          <div className={styles.artistTab}>
            {/* Artist Management Section */}
            <div className={styles.artistManagementSection}>
              <div className={styles.artistsColumn}>
                {profile && (
                  <div className={styles.artistsSection}>
                    <FavoriteArtists
                      userId={profile.id}
                      key={`favorites-${refreshFavorites}`}
                    />
                  </div>
                )}
              </div>

              <div className={styles.artistsColumn}>
                {profile && (
                  <div className={styles.searchSection}>
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
          <div className={styles.settingsTab}>
            <EditProfile user={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
