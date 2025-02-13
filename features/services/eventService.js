/**
 * Data Flow Diagram:
 *
 * EDMTrain API Data → updateDBEvents()
 *     │
 *     ├─→ addNewEventsfromEDMTrain()
 *     │   │
 *     │   ├─→ Deduplicate Events
 *     │   │
 *     │   ├─→ Process Each Event
 *     │   │   │
 *     │   │   ├─→ Venue Data → venues table
 *     │   │   ├─→ Event Data → events table
 *     │   │   └─→ Artist Data → event_artists table
 *     │   │
 *     │   └─→ Batch Database Operations
 *     │       │
 *     │       ├─→ 1. Upsert venues table
 *     │       ├─→ 2. Upsert events table
 *     │       └─→ 3. Upsert event_artists table
 *     │
 *     └─→ deleteOldEvents()
 *         │
 *         ├─→ Find Events Older Than 1 Day
 *         │   (Processed in Batches)
 *         │
 *         └─→ Delete Operations
 *             ├─→ 1. Delete from event_artists table
 *             └─→ 2. Delete from events table
 */

import supabase from "../../features/Supabase";

/**
 * Deletes events that are older than one day from the database
 * Uses batch processing to handle large datasets efficiently
 * Handles related records in event_artists table first to maintain referential integrity
 */
const deleteOldEvents = async () => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1); // events older than one day
  // Batch size for processing chunks of records
  const batchSize = 900;
  let hasMore = true;
  let totalDeleted = 0;
  let lastId = 0;

  try {
    while (hasMore) {
      // Get next batch of old events using pagination with ID
      const { data: oldEvents, error: fetchError } = await supabase
        .from("events")
        .select("id")
        .not("event_date", "is", null)
        .lt("event_date", oneDayAgo.toISOString())
        .gt("id", lastId) // Get records after the last ID we processed
        .order("id", { ascending: true })
        .limit(batchSize);

      if (fetchError) {
        console.error("Error fetching old events:", fetchError);
        throw fetchError;
      }

      // Process events in batches to avoid memory issues
      if (!oldEvents || oldEvents.length === 0) {
        console.log(`Finished deleting events. Total deleted: ${totalDeleted}`);
        hasMore = false;
        continue;
      }

      const batchIds = oldEvents.map((event) => event.id);
      lastId = batchIds[batchIds.length - 1]; // Track last processed ID for pagination

      // Delete related artist entries first to maintain referential integrity
      const { error: artistError } = await supabase
        .from("event_artists")
        .delete()
        .in("event_id", batchIds);

      if (artistError) {
        console.error("Error deleting artist entries:", artistError);
        throw artistError;
      }

      // Delete the events after removing related records
      const { error: eventError } = await supabase
        .from("events")
        .delete()
        .in("id", batchIds);

      if (eventError) {
        console.error("Error deleting events:", eventError);
        throw eventError;
      }

      totalDeleted += batchIds.length;
      console.log(
        `Deleted batch of ${batchIds.length} events. Running total: ${totalDeleted}`
      );

      // Check if we've processed all records
      if (oldEvents.length < batchSize) {
        hasMore = false;
      }
    }
  } catch (error) {
    console.error("Error in deleteOldEvents:", error);
    throw error;
  }
};

/**
 * Processes new events from EDMTrain API and adds them to the database
 * Handles venues, events, and artists in batch operations
 * Uses upsert to avoid duplicates and update existing records
 * @param {Array} data - Array of event data from EDMTrain API
 * @param {string} locationId - Location ID for the events
 */
const addNewEventsfromEDMTrain = async (data, locationId) => {
  console.log(`Processing ${data.length} total records from EDMTrain...`);

  // Remove duplicate events by ID
  const uniqueEvents = Array.from(
    new Map(data.map((event) => [event.id, event])).values()
  );
  console.log(`Found ${uniqueEvents.length} unique events after deduplication`);

  // Maps to collect unique records for batch processing
  const venueMap = new Map();
  const eventMap = new Map();
  const artistMap = new Map();

  // Process each event and collect related data
  uniqueEvents.forEach((event) => {
    // Skip events without venue information
    if (!event.venue) {
      console.warn(`Skipping event ${event.id}: Missing venue data`);
      return;
    }

    // Prepare venue data with location reference
    venueMap.set(event.venue.id, {
      id: event.venue.id,
      name: event.venue.name || "",
      location: event.venue.location || "",
      address: event.venue.address || "",
      state: event.venue.state || "",
      latitude: event.venue.latitude || null,
      longitude: event.venue.longitude || null,
      location_id: locationId,
    });

    // Prepare event data with venue and location references
    eventMap.set(event.id, {
      id: event.id,
      event_name: event.name || "",
      event_link: event.link || "",
      ages: event.ages || "",
      is_festival: Boolean(event.festivalInd),
      is_livestream: Boolean(event.livestreamInd),
      is_electronic: Boolean(event.electronicGenreInd),
      is_other_genre: Boolean(event.otherGenreInd),
      event_date: event.date || null,
      start_time: event.startTime || null,
      end_time: event.endTime || null,
      created_date: event.createdDate || null,
      venue_id: event.venue.id,
      location_id: locationId,
    });

    // Process artist list and prepare artist-event relationships
    if (event.artistList && Array.isArray(event.artistList)) {
      event.artistList.forEach((artist) => {
        const key = `${event.id}_${artist.id}`;
        artistMap.set(key, {
          event_id: event.id,
          artist_id: artist.id,
          artist_name: artist.name || "",
          artist_link: artist.link || "",
          is_b2b: Boolean(artist.b2bInd),
        });
      });
    }
  });

  try {
    // Convert collected data to arrays for batch operations
    const venueData = Array.from(venueMap.values());
    const eventsToInsert = Array.from(eventMap.values());
    const artistData = Array.from(artistMap.values());

    console.log("Batch operation quantities:", {
      venues: venueData.length,
      events: eventsToInsert.length,
      artists: artistData.length,
    });

    // Batch upsert venues
    if (venueData.length > 0) {
      const { error: venueError } = await supabase
        .from("venues")
        .upsert(venueData, { onConflict: "id" });

      if (venueError) throw venueError;
      console.log(`✓ Successfully processed ${venueData.length} venues`);
    }

    // Batch upsert events
    if (eventsToInsert.length > 0) {
      const { error: eventError } = await supabase
        .from("events")
        .upsert(eventsToInsert, { onConflict: "id" });

      if (eventError) throw eventError;
      console.log(`✓ Successfully processed ${eventsToInsert.length} events`);
    }

    // Batch upsert artists
    if (artistData.length > 0) {
      const { error: artistError } = await supabase
        .from("event_artists")
        .upsert(artistData, { onConflict: "event_id,artist_id" });

      if (artistError) throw artistError;
      console.log(
        `✓ Successfully processed ${artistData.length} artist entries`
      );
    }

    console.log("All batch operations completed successfully");
  } catch (error) {
    console.error("Batch operation error:", error);
    throw error;
  }
};

/**
 * Main function to update database events
 * Adds new events and removes old ones in a single operation
 * @param {Array} data - Array of event data from EDMTrain API
 * @param {string} locationId - Location ID for the events
 */
export const updateDBEvents = async (data, locationId) => {
  await addNewEventsfromEDMTrain(data, locationId);
  await deleteOldEvents();
};
