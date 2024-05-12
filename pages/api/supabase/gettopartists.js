import supabase from "../../../features/Supabase";

const getData = async () => {
  try {
    let { data, error } = await supabase.from("topartists").select("*");

    if (error) {
      console.error("Error fetching data: ", error);
      return;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error occurred: ", error);
  }
};

export default async function handler(req, res) {
  try {
    const data = await getData();
    res.setHeader("Cache-Control", "s-maxage=604800"); // cache for one week
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in handler: ", error);
    res.status(500).json({ error });
  }
}
