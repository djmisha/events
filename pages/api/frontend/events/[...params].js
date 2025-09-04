/**
 * Frontend-safe proxy endpoint for SDHM events
 * This endpoint is open to frontend calls and internally uses authenticated fetch
 * to retrieve data from the secured SDHM endpoint
 */
import secureApiEndpoint from "../../../../utils/apiSecurity";
import { authenticatedFetch } from "../../../../utils/authenticatedFetch";

export default async function handler(req, res) {
  // Apply security checks (this endpoint is in FRONTEND_OPEN_ENDPOINTS so it will pass)
  const security = secureApiEndpoint(req, res);

  // Handle preflight requests
  if (security.isPreflight) {
    return res.status(200).end();
  }

  // Check if request is allowed (should be true for frontend endpoints)
  if (!security.allowed) {
    return res.status(401).json({
      error: security.error || "Unauthorized access",
    });
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { params } = req.query;

    // Validate parameters
    if (!params || params.length !== 2) {
      return res.status(400).json({
        error:
          "Invalid parameters. Expected format: /api/frontend/events/[locationId]/[city]",
      });
    }

    const [locationId, city] = params;

    // Validate locationId is numeric
    if (isNaN(locationId)) {
      return res.status(400).json({
        error: "Location ID must be numeric",
      });
    }

    // Make authenticated request to the secured SDHM endpoint
    const sdhmUrl = `/api/sdhm/${locationId}/${encodeURIComponent(city)}`;
    const data = await authenticatedFetch(sdhmUrl);

    // Return the data
    res.status(200).json(data);
  } catch (error) {
    console.error("Frontend events proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch events data",
      message: error.message,
    });
  }
}
