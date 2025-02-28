import supabase from "../../../features/Supabase";

const CACHE_MAX_AGE = 604800; // 1 week in seconds

export default async function handler(req, res) {
  const { id } = req.query;
  console.log(`Fetching venues for location_id: ${id}`);

  try {
    // Ensure location_id is treated as string for comparison
    const locationId = String(id);

    // First, get total count with SQL
    const { count, error: countError } = await supabase
      .from("venues")
      .select("*", { count: "exact", head: true })
      .eq("location_id", locationId);

    if (countError) throw countError;
    console.log(`Count from Supabase API: ${count}`);

    // Double check with a raw SQL count query through SQL API
    const { data: rawCount, error: rawCountError } = await supabase.rpc(
      "get_venue_count_by_location",
      { location_id_param: locationId }
    );

    if (rawCountError) {
      console.warn(
        "SQL count query failed, using API count instead:",
        rawCountError
      );
    } else {
      console.log(`Count from raw SQL: ${rawCount}`);
    }

    // Explicitly set a very high limit to override any defaults
    const { data: venues, error } = await supabase
      .from("venues")
      .select("*")
      .eq("location_id", locationId)
      .order("id", { ascending: true })
      .limit(1000); // Set explicit high limit

    if (error) throw error;

    const retrievedCount = venues?.length || 0;
    console.log(`Retrieved ${retrievedCount} venues for location ${id}`);

    // Warn if counts don't match
    const expectedCount = rawCount || count;
    if (retrievedCount !== expectedCount) {
      console.warn(
        `WARNING: Retrieved ${retrievedCount} venues but expected ${expectedCount}`
      );

      // Log first few and last few venues for debugging
      if (venues && venues.length > 0) {
        console.log(
          "First 3 venues:",
          venues.slice(0, 3).map((v) => `${v.id}: ${v.name}`)
        );
        console.log(
          "Last 3 venues:",
          venues.slice(-3).map((v) => `${v.id}: ${v.name}`)
        );
      }
    }

    res.setHeader(
      "Cache-Control",
      `s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`
    );

    return res.status(200).json({ data: venues });
  } catch (error) {
    console.error("Error fetching venues:", error);
    return res.status(500).json({ error: error.message });
  }
}
