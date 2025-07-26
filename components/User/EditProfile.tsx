import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { AppContext } from "../../features/AppContext";
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
  // Replace single loading state with two separate loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
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

  // Memoize the validation function to prevent unnecessary recalculations
  const validateForm = useCallback((profileData: Partial<Profile>) => {
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
  }, []);

  // Update input handler to sanitize input
  const handleInputChange = useCallback(
    (field: keyof Profile, value: string) => {
      // If it's a URL field, don't sanitize as strictly
      const sanitizedValue = ["avatar_url", "website"].includes(field)
        ? value.trim()
        : sanitizeInput(value.trim());

      setProfile((prev) => ({ ...prev, [field]: sanitizedValue }));
    },
    []
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoadingProfile(true);
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
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user.id, supabase, validateForm]);

  // Validate whenever profile changes
  useEffect(() => {
    validateForm(profile);
  }, [profile, validateForm]);

  const updateProfile = useCallback(async () => {
    // Validate before submitting
    if (!validateForm(profile)) {
      setMessage({
        type: "error",
        text: "Please fix the validation errors before submitting",
      });
      return;
    }

    try {
      setIsLoadingProfile(true);

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
      setIsLoadingProfile(false);
    }
  }, [profile, validateForm, user.id, supabase]);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoadingLogout(true);
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
      setIsLoadingLogout(false);
    }
  }, [supabase, router]);

  // Helper function to get grouped locations for the dropdown
  const groupedLocations = useMemo(() => {
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
  }, []);

  return (
    <div className="flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-[10px]">
        <h2>Profile Settings</h2>
        {message && (
          <div
            className={`p-3 mb-4 rounded-md text-sm text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
        <form>
          {/* <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={user.email || ""}
              disabled
              className="w-[calc(100%-2rem)] py-3 px-4 border border-gray-300 rounded-md text-base transition-colors duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <small className="block text-gray-500 text-xs mt-1">
              Your email cannot be changed
            </small>
          </div> */}

          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={profile.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`w-[calc(100%-2rem)] py-3 px-4 border border-gray-300 rounded-md text-base transition-colors duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                validationErrors.username || validationErrors.usernamePattern
                  ? "border-red-500 bg-red-500/5"
                  : ""
              }`}
              maxLength={20}
              pattern="[a-zA-Z0-9_-]{3,20}"
            />
            {validationErrors.username && (
              <small className="text-red-500 text-xs mt-1 block">
                Username is required
              </small>
            )}
            {validationErrors.usernamePattern && !validationErrors.username && (
              <small className="text-red-500 text-xs mt-1 block">
                Username must be 3-20 characters and contain only letters,
                numbers, underscores or hyphens
              </small>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className={`w-[calc(100%-2rem)] py-3 px-4 border border-gray-300 rounded-md text-base transition-colors duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                validationErrors.fullNamePattern
                  ? "border-red-500 bg-red-500/5"
                  : ""
              }`}
              maxLength={100}
            />
            {validationErrors.fullNamePattern && (
              <small className="text-red-500 text-xs mt-1 block">
                Full name contains invalid characters
              </small>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="avatar_url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Avatar URL (add a link to your profile image)
            </label>
            <input
              id="avatar_url"
              type="url"
              value={profile.avatar_url}
              onChange={(e) => handleInputChange("avatar_url", e.target.value)}
              className={`w-[calc(100%-2rem)] py-3 px-4 border border-gray-300 rounded-md text-base transition-colors duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                validationErrors.avatarUrlPattern
                  ? "border-red-500 bg-red-500/5"
                  : ""
              }`}
              placeholder="https://example.com/avatar.png"
            />
            {validationErrors.avatarUrlPattern && profile.avatar_url && (
              <small className="text-red-500 text-xs mt-1 block">
                Please enter a valid URL
              </small>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website
            </label>
            <input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className={`w-[calc(100%-2rem)] py-3 px-4 border border-gray-300 rounded-md text-base transition-colors duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                validationErrors.websitePattern
                  ? "border-red-500 bg-red-500/5"
                  : ""
              }`}
              placeholder="https://example.com"
            />
            {validationErrors.websitePattern && profile.website && (
              <small className="text-red-500 text-xs mt-1 block">
                Please enter a valid URL
              </small>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="default_location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Default Location <span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              id="default_location"
              className={`w-[calc(100%-2rem)] py-3 px-4 border border-gray-300 rounded-md text-base transition-colors duration-150 ease-in-out focus:border-indigo-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                validationErrors.default_location_id
                  ? "border-red-500 bg-red-500/5"
                  : ""
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
              <small className="text-red-500 text-xs mt-1 block">
                Default location is required
              </small>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                updateProfile();
              }}
              disabled={isLoadingProfile || !formValid}
              className="flex-1 py-3 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ease-in-out bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoadingProfile ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
