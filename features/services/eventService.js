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

// Add utility functions and constants
const BATCH_SIZES = {
  DELETE: 50, // Reduced batch size for deletes
  UPSERT: 25, // Small batch size for upserts
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry operation with exponential backoff
 */
const retryOperation = async (operation, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.warn(
        `Attempt ${
          attempt + 1
        }/${maxRetries} failed. Retrying in ${waitTime}ms...`
      );
      await delay(waitTime);
      if (attempt === maxRetries - 1) throw error;
    }
  }
};

/**
 * Process data in smaller batches
 */
const processBatch = async (items, operation) => {
  const results = [];
  for (let i = 0; i < items.length; i += BATCH_SIZES.UPSERT) {
    const batch = items.slice(i, i + BATCH_SIZES.UPSERT);
    await delay(500); // Delay between batches
    const result = await retryOperation(() => operation(batch));
    results.push(result);
  }
  return results;
};

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
      await delay(1000); // Delay between main batch operations

      // Get next batch of old events using pagination with ID
      const { data: oldEvents, error: fetchError } = await supabase
        .from("events")
        .select("id")
        .not("event_date", "is", null)
        .lt("event_date", oneDayAgo.toISOString())
        .gt("id", lastId) // Get records after the last ID we processed
        .order("id", { ascending: true })
        .limit(BATCH_SIZES.DELETE);

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
      await retryOperation(async () => {
        const { error } = await supabase
          .from("event_artists")
          .delete()
          .in("event_id", batchIds);
        if (error) throw error;
      });

      await delay(500); // Delay between deletes

      // Delete the events after removing related records
      await retryOperation(async () => {
        const { error } = await supabase
          .from("events")
          .delete()
          .in("id", batchIds);
        if (error) throw error;
      });

      totalDeleted += batchIds.length;
      console.log(
        `Deleted batch of ${batchIds.length} events. Running total: ${totalDeleted}`
      );

      // Check if we've processed all records
      if (oldEvents.length < BATCH_SIZES.DELETE) {
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

    console.log("Starting batch operations with sizes:", {
      venues: venueData.length,
      events: eventsToInsert.length,
      artists: artistData.length,
    });

    // Process venues in batches
    if (venueData.length > 0) {
      await processBatch(venueData, async (batch) => {
        const { error } = await supabase
          .from("venues")
          .upsert(batch, { onConflict: "id" });
        if (error) throw error;
      });
      console.log(`✓ Processed ${venueData.length} venues`);
    }

    // Process events in batches
    if (eventsToInsert.length > 0) {
      await processBatch(eventsToInsert, async (batch) => {
        const { error } = await supabase
          .from("events")
          .upsert(batch, { onConflict: "id" });
        if (error) throw error;
      });
      console.log(`✓ Processed ${eventsToInsert.length} events`);
    }

    // Process artists in batches
    if (artistData.length > 0) {
      await processBatch(artistData, async (batch) => {
        const { error } = await supabase
          .from("event_artists")
          .upsert(batch, { onConflict: "event_id,artist_id" });
        if (error) throw error;
      });
      console.log(`✓ Processed ${artistData.length} artist entries`);
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
