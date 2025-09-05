import secureApiEndpoint from "../../../utils/apiSecurity";
import { transformEventsArray } from "../../../utils/eventTransformer";
import localArtists from "../../../localArtistsDB.json";

/**
 * Calculate similarity between two strings using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @param {string} city - City name for venue normalization
 * @returns {number} - Similarity score between 0 and 1
 */
const calculateSimilarity = (str1, str2, city = "") => {
  if (!str1 || !str2) return 0;

  // Normalize strings: lowercase, remove extra spaces, common words
  const normalize = (str) => {
    const cityPattern = city ? `|${city.toLowerCase()}` : "";
    const regex = new RegExp(
      `\\b(nightclub|club|theater|theatre|venue${cityPattern})\\b`,
      "g"
    );

    return str
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(regex, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const normalizedStr1 = normalize(str1);
  const normalizedStr2 = normalize(str2);

  // If one string contains the other after normalization, they're very similar
  if (
    normalizedStr1.includes(normalizedStr2) ||
    normalizedStr2.includes(normalizedStr1)
  ) {
    return 0.9;
  }

  // Calculate Levenshtein distance
  const matrix = [];
  const len1 = normalizedStr1.length;
  const len2 = normalizedStr2.length;

  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = normalizedStr1[i - 1] === normalizedStr2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  // Convert distance to similarity (0-1 scale)
  const maxLength = Math.max(len1, len2);
  return maxLength === 0 ? 1 : (maxLength - matrix[len1][len2]) / maxLength;
};

/**
 * Remove duplicate events based on date and venue similarity
 * @param {Array} events - Array of events
 * @param {string} city - City name for venue normalization
 * @returns {Array} - Array with duplicates removed
 */
const removeDuplicateEvents = (events, city = "") => {
  return events.reduce((acc, event) => {
    const duplicateIndex = acc.findIndex((e) => {
      // Must be the same date
      if (e.date !== event.date) return false;

      // Check for exact venue match first
      if ((e.venue?.name).toLowerCase() === (event.venue?.name).toLowerCase())
        return true;

      // Check for similar venue names (threshold: 0.8 similarity)
      const similarity = calculateSimilarity(
        e.venue?.name,
        event.venue?.name,
        city
      );
      if (similarity >= 0.8) return true;

      return false;
    });

    if (duplicateIndex !== -1) {
      // Prefer ticketmaster data over other sources
      if (event.eventSource === "ticketmaster") {
        acc[duplicateIndex] = event;
      }
      // Otherwise keep the first one (which could be ticketmaster or any other source)
    } else {
      acc.push(event);
    }

    return acc;
  }, []);
};

/**
 * Sort events by date (earliest first)
 * @param {Array} events - Array of events
 * @returns {Array} - Array sorted by date
 */
const sortEventsByDate = (events) => {
  return events.sort((a, b) => {
    // Handle cases where date might be null or undefined
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1; // Put events without dates at the end
    if (!b.date) return -1; // Put events without dates at the end

    // Convert dates to Date objects for comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Sort in ascending order (earliest first)
    return dateA - dateB;
  });
};

/**
 * Format TicketMaster events with local artists data
 * @param {Array} events - Array of events
 * @returns {Array} - Formatted events array
 */
const formatTicketMasterwithImagesArtists = (events) => {
  return events.map((event) => {
    // Check if artistList is not empty and event name exists
    if (
      event.eventSource === "ticketmaster" &&
      event.artistList.length != 0 &&
      event.name
    ) {
      const matchedArtist = localArtists.find((artist) => {
        return (
          event.artistList[0].name.toLowerCase() == artist.name.toLowerCase()
        );
      });

      // If a match is found, use the local artist's name and ID for image to work
      if (matchedArtist) {
        console.log(
          `Matched artist: ${matchedArtist.name} for event: ${event.name}`
        );
        return {
          ...event,
          artistList: [{ name: matchedArtist.name, id: matchedArtist.id }],
        };
      }

      // puts the event name as the artist if no match found
      return {
        ...event,
        artistList: [{ name: event.name }],
      };
    }

    return event;
  });
};

/**
 * Convert a date to YYYY-MM-DD string format, handling timezone issues
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Date in YYYY-MM-DD format
 */
const toDateString = (date) => {
  if (typeof date === "string") {
    return date.split("T")[0]; // Extract date part from ISO string
  }

  // For Date objects, use local date to avoid timezone issues
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Filter out events that are past today's date
 * @param {Array} events - Array of events
 * @returns {Array} - Array with past events removed
 */
const filterPastEvents = (events) => {
  const todayString = toDateString(new Date());

  return events.filter((event) => {
    if (!event.date) return false;
    return toDateString(event.date) >= todayString;
  });
};

/**
 * Process SDHM events through the complete pipeline
 * @param {Array} rawEvents - Raw events data from SDHM API
 * @param {string} city - City name for venue normalization
 * @returns {Array} - Processed and filtered events array
 */
const processSDHMEvents = (rawEvents, city = "") => {
  if (!Array.isArray(rawEvents) || rawEvents.length === 0) {
    return [];
  }

  try {
    // Step 1: Sort events by date
    const sorted = sortEventsByDate(rawEvents);

    // Step 2: Remove duplicate events
    const deduped = removeDuplicateEvents(sorted, city);

    // Step 3: Transform the new API data to match the legacy format
    const transformedEvents = transformEventsArray(deduped);

    // Step 4: Format with local artists data and add IDs
    const withArtistsEvents =
      formatTicketMasterwithImagesArtists(transformedEvents);

    // Step 5: Filter out past events
    const filteredEvents = filterPastEvents(withArtistsEvents);

    return filteredEvents;
  } catch (error) {
    console.error("Error processing SDHM events:", error);
    return [];
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
    const rawEvents = data.data || [];

    // Process events through the complete pipeline
    const processedEvents = processSDHMEvents(rawEvents, city);

    // Set cache headers for 12 hours (43200 seconds)
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=43200, stale-while-revalidate=86400"
    );

    // Return the processed events with additional metadata
    return res.status(200).json({
      success: true,
      cacheExpiry: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      data: processedEvents,
      count: processedEvents.length,
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
