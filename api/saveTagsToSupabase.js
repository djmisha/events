import { supabaseAdmin } from "../features/Supabase";

export const saveTagsToSupabase = async (tags) => {
  const chunkSize = 1000;
  for (let i = 0; i < tags.length; i += chunkSize) {
    const chunk = tags.slice(i, i + chunkSize);
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
};
