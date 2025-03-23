import { useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import styles from "./UserDashboard.module.scss";
import { AppContext } from "../../features/AppContext";
import FavoriteArtists from "./FavoriteArtists";
import ArtistSearch from "./ArtistSearch";
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
  user,
  profile: serverProfile,
  defaultLocation,
}: UserDashboardProps) {
  const { profile: contextProfile } = useContext(AppContext);
  const [formattedLocation, setFormattedLocation] =
    useState<FormattedLocation | null>(null);
  const [refreshFavorites, setRefreshFavorites] = useState(0);

  // Use server provided profile or context profile
  const profile = serverProfile || contextProfile;

  // Use server-side defaultLocation or find it client side
  useEffect(() => {
    if (defaultLocation) {
      // Use the server provided location data
      setFormattedLocation({
        id: defaultLocation.id,
        city: defaultLocation.city || defaultLocation.state,
        state: defaultLocation.state,
        slug: `location/${defaultLocation.id}`,
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
          setFormattedLocation({
            id: location.id,
            city: location.city || location.state, // If city is null, use state name
            state: location.state,
            slug: `location/${location.id}`,
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
      {/* Greeting section */}
      {profile && (
        <div className={styles.greetingSection}>
          <h2>
            Greetings,{" "}
            {profile.username || profile.email?.split("@")[0] || "User"}
          </h2>
        </div>
      )}
      {/* Default city section */}
      {formattedLocation && (
        <div className={styles.defaultCitySection}>
          <h3>Your Default City</h3>
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

      <h2 className={styles.sectionTitle}>Quick Access</h2>
      <div className={styles.dashboardGrid}>
        <Link href="/profile" className={styles.dashboardCard}>
          <h3>Profile</h3>
          <p>View and edit your profile information</p>
        </Link>

        <div className={styles.dashboardCard}>
          <h3>My Events</h3>
          <p>Coming soon... manage events you have favorited</p>
        </div>
        {/* 
        <div className={styles.dashboardCard}>
          <h3>Messages</h3>
          <p>View your messages and notifications</p>
        </div>

        <div className={styles.dashboardCard}>
          <h3>Settings</h3>
          <p>Adjust your account settings and preferences</p>
        </div> */}
      </div>
    </div>
  );
}
