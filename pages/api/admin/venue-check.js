import supabase from "../../../features/Supabase";
import locations from "../../../utils/locations.json";

// Expected minimum venues for major cities
const expectedMinimumVenues = {
  // Major US cities
  Chicago: 30, // Location ID 71
  Denver: 77, // Location ID 87
  // Add more expectations as needed
};

export default async function handler(req, res) {
  // Simple API key check - replace with proper auth in production
  // if (req.headers.authorization !== `Bearer ${process.env.ADMIN_API_KEY}`) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  try {
    const cityMap = {};
    const results = [];

    // Build map of location ID to city name
    locations.forEach((loc) => {
      if (loc.city) {
        cityMap[loc.id] = loc.city;
      }
    });

    // For each location with a city, get a count
    const cityLocationIds = Object.keys(cityMap);
    console.log(
      `Checking venue counts for ${cityLocationIds.length} city locations`
    );

    // Process locations in batches to prevent overloading
    const locationBatchSize = 5;

    for (let i = 0; i < cityLocationIds.length; i += locationBatchSize) {
      const batchLocationIds = cityLocationIds.slice(i, i + locationBatchSize);
      console.log(
        `Processing location batch ${
          i / locationBatchSize + 1
        }: ${batchLocationIds.join(", ")}`
      );

      // Process each location in this batch
      await Promise.all(
        batchLocationIds.map(async (locationId) => {
          const { count, error } = await supabase
            .from("venues")
            .select("*", { count: "exact", head: true })
            .eq("location_id", locationId);

          if (error) {
            console.error(
              `Error counting venues for location ${locationId}:`,
              error
            );
            return;
          }

          const cityName = cityMap[locationId];
          const expectedMin = cityName ? expectedMinimumVenues[cityName] : null;

          results.push({
            location_id: locationId,
            city: cityName || "Unknown",
            venue_count: count,
            expected_minimum: expectedMin || "Not specified",
            status:
              expectedMin && count < expectedMin ? "BELOW_EXPECTED" : "OK",
          });
        })
      );
    }

    // Sort by venue count (ascending)
    results.sort((a, b) => a.venue_count - b.venue_count);

    return res.status(200).json({
      total_locations_with_venues: results.length,
      locations_below_expectations: results.filter(
        (r) => r.status === "BELOW_EXPECTED"
      ).length,
      results,
    });
  } catch (error) {
    console.error("Error checking venues:", error);
    return res.status(500).json({ error: error.message });
  }
}
