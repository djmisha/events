import { supabaseAdmin } from "../../../features/Supabase";
import { secureApiEndpoint } from "../../../utils/apiSecurity";

const getData = async () => {
  try {
    let { data, error } = await supabaseAdmin.from("topartists").select("*");

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
  // Apply security checks
  const security = secureApiEndpoint(req, res);

  // Handle preflight requests
  if (security.isPreflight) {
    return res.status(200).end();
  }

  // Check if request is allowed
  if (!security.allowed) {
    return res.status(401).json({
      error: security.error || "Unauthorized access",
    });
  }

  try {
    const data = await getData();
    res.setHeader("Cache-Control", "s-maxage=432000");
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in handler: ", error);
    res.status(500).json({ error });
  }
}
