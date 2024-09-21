import supabase from "../../../features/Supabase";

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

export default async function handler(req, res) {
  try {
    // Fetch all existing artists from Supabase
    const artists = await fetchExistingArtists();

    // Send a response with the fetched artists
    res.status(200).json({ message: "Artists fetched successfully", artists });
  } catch (error) {
    console.error("Error in handler:", error);
    res
      .status(500)
      .json({ message: "Error fetching artists", error: error.message });
  }
}
