import { useState, useEffect, useContext } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { AppContext } from "../../features/AppContext";
import styles from "./EditProfile.module.scss";
import locations from "../../utils/locations.json";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
  default_location_id?: number; // Added field for default location
}

interface ProfileFormProps {
  user: User;
}

export default function EditProfile({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: "",
    full_name: "",
    avatar_url: "",
    website: "",
    default_location_id: undefined,
  });

  const { supabase } = useContext(AppContext);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("No profile found");
        } else if (data) {
          setProfile({
            username: data.username || "",
            full_name: data.full_name || "",
            avatar_url: data.avatar_url || "",
            website: data.website || "",
            default_location_id: data.default_location_id || undefined,
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user.id, supabase]);

  async function updateProfile() {
    try {
      setLoading(true);

      // Ensure default_location_id is converted to a number before sending to the database
      const updates = {
        id: user.id,
        ...profile,
        default_location_id: profile.default_location_id
          ? parseInt(String(profile.default_location_id), 10)
          : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates, {
        onConflict: "id",
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  }

  // Helper function to get grouped locations for the dropdown
  const getGroupedLocations = () => {
    // Group locations by state
    const stateGroups: Record<string, typeof locations> = {};

    locations.forEach((location) => {
      const state = location.state;
      if (!stateGroups[state]) {
        stateGroups[state] = [];
      }
      stateGroups[state].push(location);
    });

    return stateGroups;
  };

  const groupedLocations = getGroupedLocations();

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Profile Settings</h1>
        {message && (
          <div
            className={`${styles.message} ${
              message.type === "success"
                ? styles.successMessage
                : styles.errorMessage
            }`}
          >
            {message.text}
          </div>
        )}
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="text"
              value={user.email || ""}
              disabled
              className={styles.input}
            />
            <small className={styles.helperText}>
              Your email cannot be changed
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="full_name" className={styles.label}>
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="avatar_url" className={styles.label}>
              Avatar URL (add a link to your profile image)
            </label>
            <input
              id="avatar_url"
              type="url"
              value={profile.avatar_url}
              onChange={(e) =>
                setProfile({ ...profile, avatar_url: e.target.value })
              }
              className={styles.input}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="website" className={styles.label}>
              Website
            </label>
            <input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) =>
                setProfile({ ...profile, website: e.target.value })
              }
              className={styles.input}
              placeholder="https://example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="default_location" className={styles.label}>
              Default Location
            </label>
            <select
              id="default_location"
              className={styles.input}
              value={profile.default_location_id || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  default_location_id: e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined,
                })
              }
            >
              <option value="">Select a location</option>
              {Object.keys(groupedLocations)
                .sort()
                .map((state) => (
                  <optgroup key={state} label={state}>
                    {groupedLocations[state]
                      .filter((location) => location.city) // Only include locations with cities
                      .sort((a, b) =>
                        a.city && b.city ? a.city.localeCompare(b.city) : 0
                      )
                      .map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.city
                            ? `${location.city}, ${location.stateCode}`
                            : location.state}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={updateProfile}
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
