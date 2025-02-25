import supabase from "../../features/Supabase";

// Cache configuration constants
const HOURS = 6;
const CACHE_MAX_AGE = HOURS * 60 * 60; // 6 hours in seconds

/**
 * Ensures a cache entry exists for the given location
 * If no entry exists, creates one with immediate update needed
 * @param {string} locationId - The ID of the location to initialize
 */
const ensureCacheEntry = async (locationId) => {
  const { data, error } = await supabase
    .from("cache_control")
    .select("location_id")
    .eq("location_id", locationId)
    .maybeSingle();

  if (error) {
    console.error("Cache initialization error:", error);
    return;
  }

  if (!data) {
    const now = new Date();
    // Create initial cache entry with expired timestamp to force update
    const { error: insertError } = await supabase.from("cache_control").insert({
      location_id: locationId,
      last_update: now.toISOString(),
      next_update: now.toISOString(), // Set to current time to trigger immediate update
    });

    if (insertError) {
      console.error("Cache entry creation error:", insertError);
    }
  }
};

/**
 * Determines if a location's cached data needs to be updated
 * @param {string} locationId - The ID of the location to check
 * @returns {Promise<boolean>} - True if cache needs update, false otherwise
 */
export const checkNeedsUpdate = async (locationId) => {
  // Ensure cache entry exists before checking
  await ensureCacheEntry(locationId);

  const now = new Date();

  // Query the cache_control table for the location's next update time
  const { data, error } = await supabase
    .from("cache_control")
    .select("next_update")
    .eq("location_id", locationId)
    .maybeSingle(); // Changed from single() to maybeSingle()

  // If there's an error that's not related to finding rows
  if (error) {
    console.error("Cache check error:", error);
    return true; // Conservative approach: update on error
  }

  // Return true if no cache entry exists or if cache has expired
  if (!data || new Date(data.next_update) <= now) {
    return true;
  }

  return false;
};

/**
 * Updates the cache timestamp for a location
 * Sets both the last_update time (now) and next_update time (now + cache duration)
 * @param {string} locationId - The ID of the location to update
 * @throws Will throw an error if the database update fails
 */
export const updateCacheTimestamp = async (locationId) => {
  const now = new Date();
  const nextUpdate = new Date(now.getTime() + CACHE_MAX_AGE * 1000);

  // Log cache timing details for debugging
  console.log("Cache timing:", {
    currentTime: now.toISOString(),
    nextUpdate: nextUpdate.toISOString(),
    cacheLength: `${HOURS} hours`,
    milliseconds: CACHE_MAX_AGE * 1000,
  });

  // Upsert cache control record
  const { error } = await supabase.from("cache_control").upsert({
    location_id: locationId,
    last_update: now.toISOString(),
    next_update: nextUpdate.toISOString(),
  });

  // Throw error if update fails
  if (error) {
    console.error("Cache update error:", error);
    throw error;
  }
};
