import { useState, useEffect, useContext } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { AppContext } from "../../features/AppContext";
import styles from "./EditProfile.module.scss";
import locations from "../../utils/locations.json";
import Button from "../Button/Button";

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

// Validation patterns
const PATTERNS = {
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  fullName: /^[a-zA-Z0-9\s-'.]{0,100}$/,
  url: /^(https?:\/\/)?([\w-]+\.)*[\w-]+\.[a-zA-Z]{2,}(\/[\w-.~:/?#[\]@!$&'()*+,;=]*)*\/?$/,
};

// Input sanitization function to prevent XSS
const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

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
  // Enhanced validation states
  const [validationErrors, setValidationErrors] = useState({
    username: false,
    usernamePattern: false,
    fullNamePattern: false,
    avatarUrlPattern: false,
    websitePattern: false,
    default_location_id: false,
  });
  const [formValid, setFormValid] = useState(true);

  const { supabase } = useContext(AppContext);

  // Enhanced validation function
  const validateForm = (profileData: Partial<Profile>) => {
    const errors = {
      username: !profileData.username || profileData.username.trim() === "",
      usernamePattern: profileData.username
        ? !PATTERNS.username.test(profileData.username)
        : false,
      fullNamePattern: profileData.full_name
        ? !PATTERNS.fullName.test(profileData.full_name)
        : false,
      avatarUrlPattern: profileData.avatar_url
        ? !PATTERNS.url.test(profileData.avatar_url)
        : false,
      websitePattern: profileData.website
        ? !PATTERNS.url.test(profileData.website)
        : false,
      default_location_id: !profileData.default_location_id,
    };

    setValidationErrors(errors);
    const isValid = !Object.values(errors).some((error) => error);
    setFormValid(isValid);

    return isValid;
  };

  // Update input handler to sanitize input
  const handleInputChange = (field: keyof Profile, value: string) => {
    // If it's a URL field, don't sanitize as strictly
    const sanitizedValue = ["avatar_url", "website"].includes(field)
      ? value.trim()
      : sanitizeInput(value.trim());

    setProfile((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

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
          const profileData = {
            username: data.username || "",
            full_name: data.full_name || "",
            avatar_url: data.avatar_url || "",
            website: data.website || "",
            default_location_id: data.default_location_id || undefined,
          };
          setProfile(profileData);

          // Validate fields on initial load
          validateForm(profileData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user.id, supabase]);

  // Validate whenever profile changes
  useEffect(() => {
    validateForm(profile);
  }, [profile]);

  async function updateProfile() {
    // Validate before submitting
    if (!validateForm(profile)) {
      setMessage({
        type: "error",
        text: "Please fix the validation errors before submitting",
      });
      return;
    }

    try {
      setLoading(true);

      // Final sanitization before database submission
      const sanitizedProfile = {
        username: sanitizeInput(profile.username?.trim() || ""),
        full_name: sanitizeInput(profile.full_name?.trim() || ""),
        avatar_url: profile.avatar_url?.trim() || "",
        website: profile.website?.trim() || "",
        default_location_id: profile.default_location_id,
      };

      // Ensure default_location_id is converted to a number before sending to the database
      const updates = {
        id: user.id,
        ...sanitizedProfile,
        default_location_id: sanitizedProfile.default_location_id
          ? parseInt(String(sanitizedProfile.default_location_id), 10)
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

  async function handleLogout() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
        setMessage({ type: "error", text: "Failed to log out" });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Unexpected error during logout:", error);
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
              Username <span className={styles.required}>*</span>
            </label>
            <input
              id="username"
              type="text"
              value={profile.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`${styles.input} ${
                validationErrors.username || validationErrors.usernamePattern
                  ? styles.inputError
                  : ""
              }`}
              maxLength={20}
              pattern="[a-zA-Z0-9_-]{3,20}"
            />
            {validationErrors.username && (
              <small className={styles.errorText}>Username is required</small>
            )}
            {validationErrors.usernamePattern && !validationErrors.username && (
              <small className={styles.errorText}>
                Username must be 3-20 characters and contain only letters,
                numbers, underscores or hyphens
              </small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="full_name" className={styles.label}>
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className={`${styles.input} ${
                validationErrors.fullNamePattern ? styles.inputError : ""
              }`}
              maxLength={100}
            />
            {validationErrors.fullNamePattern && (
              <small className={styles.errorText}>
                Full name contains invalid characters
              </small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="avatar_url" className={styles.label}>
              Avatar URL (add a link to your profile image)
            </label>
            <input
              id="avatar_url"
              type="url"
              value={profile.avatar_url}
              onChange={(e) => handleInputChange("avatar_url", e.target.value)}
              className={`${styles.input} ${
                validationErrors.avatarUrlPattern ? styles.inputError : ""
              }`}
              placeholder="https://example.com/avatar.png"
            />
            {validationErrors.avatarUrlPattern && profile.avatar_url && (
              <small className={styles.errorText}>
                Please enter a valid URL
              </small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="website" className={styles.label}>
              Website
            </label>
            <input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className={`${styles.input} ${
                validationErrors.websitePattern ? styles.inputError : ""
              }`}
              placeholder="https://example.com"
            />
            {validationErrors.websitePattern && profile.website && (
              <small className={styles.errorText}>
                Please enter a valid URL
              </small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="default_location" className={styles.label}>
              Default Location <span className={styles.required}>*</span>
            </label>
            <select
              id="default_location"
              className={`${styles.input} ${
                validationErrors.default_location_id ? styles.inputError : ""
              }`}
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
            {validationErrors.default_location_id && (
              <small className={styles.errorText}>
                Default location is required
              </small>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              onClick={updateProfile}
              disabled={loading || !formValid}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Cancel
            </Button>
          </div>

          <div className={styles.logoutSection}>
            <hr className={styles.divider} />
            <Button
              variant="logoutButton"
              onClick={handleLogout}
              disabled={loading}
              className={styles.logoutButton}
            >
              {loading ? "Processing..." : "Log Out"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
