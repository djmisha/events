/**
 * EDMtrain API
 * @param {*} req
 * @param {*} res - event data object
 */
import { secureApiEndpoint } from "../../../utils/apiSecurity";

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

  const { id } = req.query;
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = "https://edmtrain.com/api/events?artistIds=";
  const URL = EDMURL + id + "&client=" + KEY;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();
    res.setHeader("Cache-Control", "s-maxage=21600");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
    console.error(error);
  }
}
