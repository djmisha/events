import supabase from "../../../features/Supabase";
import locations from "../../../utils/locations.json";

export default async function handler(req, res) {
  const { name, city, exact = false, missing = false } = req.query;

  try {
    // For looking up missing venues
    if (missing && city) {
      // Get location id for city
      const cityData = locations.find(
        (loc) => loc.city && loc.city.toLowerCase() === city.toLowerCase()
      );

      if (!cityData) {
        return res
          .status(400)
          .json({ error: `City "${city}" not found in locations` });
      }

      const locationId = cityData.id;

      // Check for missing venues from provided list
      const venueList = req.body?.venues;
      if (!venueList || !Array.isArray(venueList)) {
        return res.status(400).json({
          error:
            "Missing venues list in request body. Send POST with {venues: ['Venue 1', 'Venue 2', ...]}",
        });
      }

      // Get all venues for this location
      const { data: existingVenues, error } = await supabase
        .from("venues")
        .select("name")
        .eq("location_id", locationId);

      if (error) throw error;

      // Convert to lowercase set for case-insensitive comparison
      const existingNames = new Set(
        existingVenues.map((v) => v.name.toLowerCase())
      );

      // Find missing venues
      const missingVenues = venueList.filter(
        (v) => !existingNames.has(v.toLowerCase())
      );

      return res.status(200).json({
        location_id: locationId,
        city: cityData.city,
        total_venues: existingVenues.length,
        provided_venues: venueList.length,
        missing_venues: missingVenues,
        missing_count: missingVenues.length,
        existing_venues: existingVenues.map((v) => v.name),
      });
    }

    // Regular venue search
    let query = supabase
      .from("venues")
      .select("*, locations:location_id(city, state, stateCode)");

    if (name) {
      // Text search with name
      if (exact) {
        query = query.eq("name", name);
      } else {
        query = query.ilike("name", `%${name}%`);
      }
    }

    if (city) {
      // Find matching location IDs first
      const matchingLocations = locations.filter(
        (loc) => loc.city && loc.city.toLowerCase().includes(city.toLowerCase())
      );

      if (matchingLocations.length > 0) {
        const locationIds = matchingLocations.map((loc) => loc.id);
        query = query.in("location_id", locationIds);
      }
    }

    const { data: venues, error } = await query;

    if (error) throw error;

    return res.status(200).json({
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    console.error("Error searching venues:", error);
    return res.status(500).json({ error: error.message });
  }
}
