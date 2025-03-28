import { supabaseAdmin } from "../../features/Supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tags } = req.body;

  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ error: "Invalid tags data" });
  }

  const normalizedTags = tags.map((tag) => ({
    ...tag,
    name: tag.name.toLowerCase().replace(/-/g, " "),
  }));

  const chunkSize = 1000;
  for (let i = 0; i < normalizedTags.length; i += chunkSize) {
    const chunk = normalizedTags.slice(i, i + chunkSize);
    for (const tag of chunk) {
      const { data, error } = await supabaseAdmin
        .from("artist_tags")
        .select("id")
        .eq("name", tag.name);

      if (error) {
        console.error("Error checking tag:", error);
        continue;
      }

      if (data.length === 0) {
        const { error: insertError } = await supabaseAdmin
          .from("artist_tags")
          .insert([{ name: tag.name }]);

        if (insertError) {
          console.error("Error inserting tag:", insertError);
        }
      }
    }
  }

  res.status(200).json({ message: "Tags saved successfully" });
}
