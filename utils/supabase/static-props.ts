import { createClient as createClientPrimitive } from "@supabase/supabase-js";

export function createClient() {
  const supabase = createClientPrimitive(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  return supabase;
}
