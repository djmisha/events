import supabase from "../../../features/Supabase";
import locations from "../../../utils/locations.json";

export default async function handler(req, res) {
  // This would normally have authentication
  // if (req.headers.authorization !== `Bearer ${process.env.ADMIN_API_KEY}`) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { venues, targetLocationId, dryRun = true } = req.body;

    if (!venues || !Array.isArray(venues) || !targetLocationId) {
      return res.status(400).json({
        error: "Invalid request. Provide venues array and targetLocationId.",
      });
    }

    // Verify the location ID exists
    const location = locations.find((loc) => loc.id == targetLocationId);
    if (!location) {
      return res.status(400).json({
        error: `Invalid location ID: ${targetLocationId}`,
      });
    }

    // For storing results
    const results = {
      dryRun,
      location: location.city || location.state,
      targetLocationId,
      processed: 0,
      added: 0,
      updated: 0,
      errors: [],
      addedVenues: [],
      updatedVenues: [],
    };

    // Process each venue
    for (const venue of venues) {
      try {
        results.processed++;

        // If it's just a string name, prepare a basic venue object
        const venueData =
          typeof venue === "string"
            ? {
                name: venue,
                location: `${location.city || location.state}, ${
                  location.stateCode
                }`,
                location_id: targetLocationId,
                state: location.state,
              }
            : { ...venue, location_id: targetLocationId };

        // Check if venue exists
        const { data: existingVenues, error: searchError } = await supabase
          .from("venues")
          .select("id, name, location_id")
          .eq("name", venueData.name);

        if (searchError) throw searchError;

        if (existingVenues.length > 0) {
          // Venue exists, update if needed
          const existingVenue = existingVenues[0];

          if (existingVenue.location_id != targetLocationId) {
            if (!dryRun) {
              const { error: updateError } = await supabase
                .from("venues")
                .update({ location_id: targetLocationId })
                .eq("id", existingVenue.id);

              if (updateError) throw updateError;
            }

            results.updated++;
            results.updatedVenues.push({
              id: existingVenue.id,
              name: existingVenue.name,
              oldLocationId: existingVenue.location_id,
              newLocationId: targetLocationId,
            });
          }
        } else {
          // Venue doesn't exist, add it
          if (!dryRun) {
            const { data, error: insertError } = await supabase
              .from("venues")
              .insert([venueData])
              .select();

            if (insertError) throw insertError;

            results.addedVenues.push(data[0]);
          } else {
            // For dry run, just report what would be added
            results.addedVenues.push(venueData);
          }

          results.added++;
        }
      } catch (error) {
        console.error(`Error processing venue "${venue}":`, error);
        results.errors.push({
          venue: typeof venue === "string" ? venue : venue.name,
          error: error.message,
        });
      }
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fixing venues:", error);
    return res.status(500).json({ error: error.message });
  }
}
