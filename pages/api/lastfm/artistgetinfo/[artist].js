/**
 * LAST FM API
 * @param {*} req
 * @param {*} res - artist data object
 */
import secureApiEndpoint from "../../../../utils/apiSecurity";

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

  const { artist } = req.query;
  const KEY = process.env.NEXT_PUBLIC_API_KEY_LASTFM;
  const URL = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${KEY}&format=json`;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();
    res.setHeader("Cache-Control", "s-maxage=2592000"); // cache for one month
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
    console.error(error);
  }
}
