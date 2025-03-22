import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { createClient } from "../utils/supabase/component";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [locationCtx, setLocationCtx] = useState([]);
  const [profile, setProfile] = useState(null);
  const supabase = createClient();
  const isProfileInitialized = useRef(false);

  // Set isProfileInitialized flag when profile is set from props
  useEffect(() => {
    if (profile && !isProfileInitialized.current) {
      isProfileInitialized.current = true;
    }
  }, [profile]);

  useEffect(() => {
    // Only fetch user data if profile is not already initialized from server props
    if (isProfileInitialized.current) return;

    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile if user exists
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
    };

    fetchUserAndProfile();
  }, [supabase]);

  const addLocation = (location) => {
    setLocationCtx((prevLocations) => {
      // Check if a location with the same id already exists in the array
      const locationExists = prevLocations.some(
        (prevLocation) => prevLocation.id === location.id
      );

      // If a location with the same id doesn't exist, add it to the array
      if (!locationExists) return [...prevLocations, location];

      // If a location with the same id already exists, return the previous array
      return prevLocations;
    });
  };

  const value = useMemo(
    () => ({
      locationCtx,
      addLocation,
      supabase,
      profile,
      setProfile,
      isLoggedIn: !!profile,
    }),
    [locationCtx, profile]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
