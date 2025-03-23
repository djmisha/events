import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./UserDashboard.module.scss";
import { AppContext } from "../../features/AppContext";
import FavoriteArtists from "./FavoriteArtists";
import UserGreeting from "./UserGreeting";
import UserWelcome from "./UserWelcome";
import ArtistSearch from "./ArtistSearch";

export default function UserDashboard() {
  const router = useRouter();
  const { profile, isLoggedIn, supabase } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [defaultCity, setDefaultCity] = useState(null);
  const [formattedLocation, setFormattedLocation] = useState(null);
  const [refreshFavorites, setRefreshFavorites] = useState(0);

  // Check auth status once
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        // Only redirect if we've confirmed there's no session
        if (!data.session) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [supabase, router]);

  // Fetch user's default city
  useEffect(() => {
    if (profile?.default_city) {
      setDefaultCity(profile.default_city);
    } else if (profile) {
      // Fetch the first city from locations table as default
      const fetchDefaultCity = async () => {
        const { data, error } = await supabase
          .from("locations")
          .select("*")
          .limit(1)
          .single();

        if (!error && data) {
          setDefaultCity(data);
        }
      };

      fetchDefaultCity();
    }
  }, [profile, supabase]);

  // Format location data for UserWelcome component
  useEffect(() => {
    if (defaultCity) {
      if (typeof defaultCity === "object") {
        setFormattedLocation({
          id: defaultCity.id,
          city: defaultCity.city || defaultCity.name,
          state: defaultCity.state || "",
          slug: defaultCity.slug || `location/${defaultCity.id}`,
        });
      }
    }
  }, [defaultCity]);

  // Callback for when an artist is added or removed
  const handleArtistToggled = () => {
    // Trigger a refresh of the FavoriteArtists component
    setRefreshFavorites((prev) => prev + 1);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Only check profile-based login after auth check is complete
  if (authChecked && !isLoggedIn) {
    return (
      <div className={styles.loadingContainer}>
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <UserGreeting />
      </div>

      {/* Replace welcome section with UserWelcome component */}
      {profile && <UserWelcome defaultLocation={formattedLocation} />}

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
        <div className={styles.dashboardCard}>
          <h3>Profile</h3>
          <p>View and edit your profile information</p>
        </div>

        <div className={styles.dashboardCard}>
          <h3>My Events</h3>
          <p>
            Coming soon... manage events you haveve created or signed up for
          </p>
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
