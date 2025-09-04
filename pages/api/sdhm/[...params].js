import secureApiEndpoint from "../../../utils/apiSecurity";

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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { params } = req.query;
    const apiKey = process.env.API_KEY_SDHM;
    const apiUrl = process.env.API_URL_SDHM;

    // Check if API key is configured
    if (!apiKey) {
      console.error("API_KEY_SDHM environment variable not set");
      return res.status(500).json({
        error: "Server configuration error",
        message: "API key not configured",
      });
    }

    // Validate params array
    if (!params || params.length < 2) {
      return res.status(400).json({
        error: "Invalid route. Expected format: /api/sdhm/[id]/[city]",
      });
    }

    const [id, city] = params;

    // Validate required parameters
    if (!id || !city) {
      return res.status(400).json({
        error: "Missing required parameters. Both id and city are required.",
      });
    }

    // Validate ID is numeric
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        error: "Invalid id parameter. Must be a number.",
      });
    }

    // URL encode the city name for safe URL construction
    const encodedCity = encodeURIComponent(city.toLowerCase());

    // Construct the external API URL
    const url = `${apiUrl}/${id}/${encodedCity}`;

    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    // Make the request to the external API
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    // Check if the external API request was successful
    if (!response.ok) {
      // Log the response body for debugging
      const errorText = await response.text();
      console.error("External API error response:", errorText);

      return res.status(response.status).json({
        error: `External API request failed with status ${response.status}`,
        message: response.statusText,
        details: errorText,
      });
    }

    // Parse the response data
    const data = await response.json();

    // Set cache headers for 12 hours (43200 seconds)
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=43200, stale-while-revalidate=86400"
    );

    // Return the data with additional metadata
    return res.status(200).json({
      success: true,
      cacheExpiry: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      ...data,
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
