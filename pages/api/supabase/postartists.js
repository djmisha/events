/// THIS WAS USED TO INSERT ARTISTS INTO SUPABASE
// Can now be refactored.

import supabase from "../../../features/Supabase";
import { getUniqueArtists } from "../../../utils/getArtists";
import sampleEvents from "../../../localArtistsDB.json";

const fetchExistingArtists = async () => {
  let allArtists = [];
  let from = 0;
  const limit = 900;
  let fetchMore = true;

  while (fetchMore) {
    const { data, error } = await supabase
      .from("artists")
      .select("id, name")
      .range(from, from + limit - 1);

    if (error) {
      console.error("Error fetching existing artists", error);
      throw error;
    }

    if (data.length > 0) {
      allArtists = [...allArtists, ...data];
      from += limit;
    } else {
      fetchMore = false;
    }
  }

  return allArtists;
};

const writeArtistsToSupabase = async (eventsArray) => {
  // Get unique artists from the incoming data
  const uniqueArtists = getUniqueArtists(eventsArray);

  // Fetch existing artists from Supabase
  const existingArtists = await fetchExistingArtists();

  // Check if existingArtists is an array and has elements
  if (!Array.isArray(existingArtists) || existingArtists.length === 0) {
    console.error(
      "No existing artists found or existingArtists is not an array"
    );
  }

  // Create a Set of existing artist IDs for quick lookup
  const existingArtistIds = new Set(existingArtists.map((artist) => artist.id));

  // Find new artists by comparing the incoming data with the existing data
  const newArtists = uniqueArtists.filter(
    (artist) => !existingArtistIds.has(artist.id)
  );

  console.log("New artists to be added: ", newArtists.length);
  console.log("existingArtistIds size: ", existingArtistIds.size);

  // Write the new artists to Supabase using upsert
  if (newArtists.length > 0) {
    const { data, error } = await supabase
      .from("artists")
      .upsert(newArtists, { onConflict: ["id"] }); // Use upsert with conflict resolution on 'id'

    if (error) {
      console.error("Error writing to Supabase", error);
      throw error;
    }

    console.log("Data written to Supabase: ", data);
    return data;
  } else {
    console.log("No new artists to add.");
    return [];
  }
};

export default async function handler(req, res) {
  res.status(200).json({ message: "Hello" });

  return;
  try {
    // Write the artists to Supabase
    const data = await writeArtistsToSupabase(sampleEvents);

    // Send a response
    res.status(200).json({ message: "Data written successfully", data });
  } catch (error) {
    console.error("Error in handler:", error);
    res
      .status(500)
      .json({ message: "Error writing data", error: error.message });
  }
}
