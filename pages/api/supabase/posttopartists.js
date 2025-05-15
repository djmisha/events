import supabase from "../../../features/Supabase";

const setData = async (artists) => {
  try {
    // Delete all rows
    let { error: deleteError } = await supabase
      .from("topartists")
      .delete()
      .gte("id", 0); // delete all rows where the id is greater than or equal to 0,

    if (deleteError) {
      console.error("Error deleting data: ", deleteError);
      throw deleteError;
    }

    // Insert new rows
    let { data, error: insertError } = await supabase
      .from("topartists")
      .insert(artists);

    if (insertError) {
      console.error("Error inserting data: ", insertError);
      throw insertError;
    }
  } catch (error) {
    console.error("Error in setData: ", error);
    throw error;
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // You can specify your frontend origin instead of '*'
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (!req.body) {
      res.status(400).json({ message: "Missing body" });
      return;
    }
    await setData(req.body);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error in handler: ", error);
    res.status(500).json({ message: error });
  }
}
