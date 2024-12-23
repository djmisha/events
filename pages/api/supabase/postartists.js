import fs from "fs";
import path from "path";
import supabase from "../../../features/Supabase";
import { getUniqueArtists } from "../../../utils/getArtists";
import sampleEvents from "../../../utils/allevents.sample.json";

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
  console.log("Unique artists: ", uniqueArtists);

  // Fetch existing artists from Supabase
  const existingArtists = await fetchExistingArtists();
  console.log("Existing artists: ", existingArtists);

  // Create a Set of existing artist IDs for quick lookup
  const existingArtistIds = new Set(existingArtists.map((artist) => artist.id));
  console.log("existingArtistIds: ", existingArtistIds);

  // Find new artists by comparing the incoming data with the existing data
  const newArtists = uniqueArtists.filter(
    (artist) => !existingArtistIds.has(artist.id)
  );
  console.log("New artists to be added: ", newArtists);
  console.log("New artists to be added: ", newArtists.length);
  console.log("existingArtistIds size: ", existingArtistIds.size);

  // Write the new artists to Supabase using upsert
  if (newArtists.length > 0) {
    const { data, error } = await supabase
      .from("artists") // Replace 'artists' with your actual table name
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

const writeToLocalJson = async (artists) => {
  const filePath = path.join(process.cwd(), "localArtistsDB.json");
  let localArtists = [];

  // Read existing data from the local JSON file
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf8");
    localArtists = JSON.parse(fileData);
  }

  // Create a Set of local artist IDs for quick lookup
  const localArtistIds = new Set(localArtists.map((artist) => artist.id));

  // Find new artists by comparing the fetched data with the local data
  const newLocalArtists = artists.filter(
    (artist) => !localArtistIds.has(artist.id)
  );

  // Append new artists to the local data
  if (newLocalArtists.length > 0) {
    localArtists = [...localArtists, ...newLocalArtists];
    fs.writeFileSync(filePath, JSON.stringify(localArtists, null, 2), "utf8");
    console.log("New artists written to local JSON file:", newLocalArtists);
  } else {
    console.log("No new artists to add to local JSON file.");
  }
};

export default async function handler(req, res) {
  // if (req.method !== "POST") {
  //   res.status(405).json({ message: "Method Not Allowed" });
  //   return;
  // }

  try {
    // Use the request body instead of the sample array
    const data = await writeArtistsToSupabase(sampleEvents);

    // Write fetched existing artists to local JSON file
    const existingArtists = await fetchExistingArtists();
    await writeToLocalJson(existingArtists);

    // Send a response
    res.status(200).json({ message: "Data written successfully", data });
  } catch (error) {
    console.error("Error in handler:", error);
    res
      .status(500)
      .json({ message: "Error writing data", error: error.message });
  }
}
