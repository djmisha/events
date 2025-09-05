/**
 * This API route provides a mobile API key based on the app version and platform (iOS or Android).
 * It performs basic validation on the incoming request and returns the API key if valid.
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { appVersion, platform } = req.body;

    // Basic validation
    if (!appVersion || !platform) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: appVersion and platform",
      });
    }

    // Validate platform
    if (!["ios", "android"].includes(platform.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "Invalid platform. ",
      });
    }

    // Optional: Add rate limiting by IP
    const clientIP =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    // Get the mobile API key from environment variables
    const mobileAPIKey = process.env.MOBILE_APP_API_KEY;

    // Optional: Log the request for monitoring
    console.log(`Providing API key for ${platform} app version ${appVersion}`);

    // Return the API key
    res.status(200).json({
      success: true,
      apiKey: mobileAPIKey,
      message: "API key provided successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in get-api-key endpoint:", error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to provide API key",
    });
  }
}
