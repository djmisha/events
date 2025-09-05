import setDates from "./setDates";
import localArtists from "../localArtistsDB.json";
import { transformEventsArray } from "./eventTransformer";
import { authenticatedFetch } from "./authenticatedFetch";

/**
 * Simple wrapper for SDHM events data (processing now done on API side)
 * @param {Array} processedEvents - Already processed events data from API
 * @param {string} city - City name (kept for compatibility)
 * @returns {Array} - Events array
 *
 * NOTE: As of the latest update, all event processing (sorting, deduplication,
 * transformation, artist matching, and filtering) is now done on the API side
 * in /api/sdhm/[...params].js for better caching and performance.
 */
export const processSDHMEvents = (processedEvents, city = "") => {
  if (!Array.isArray(processedEvents) || processedEvents.length === 0) {
    return [];
  }

  // Events are already processed on the API side, just return them
  // This function is kept for backward compatibility
  return processedEvents;
};

/**
 * Fetch and process events from SDHM API for a specific location
 * @param {number} locationId - Location ID
 * @param {string} city - City name
 * @returns {Promise<Array>} - Processed events array
 */
export const getSDHMEvents = async (locationId, city) => {
  try {
    // Check if we're running on the server-side (Node.js environment)
    const isServerSide = typeof window === "undefined";

    if (isServerSide) {
      // Server-side: Use authenticated fetch with internal token
      const apiUrl = `/api/sdhm/${locationId}/${city}`;
      const data = await authenticatedFetch(apiUrl);

      // Events are already processed on the API side
      const processedEvents = data.data || [];

      // Use the wrapper function for consistency (events already processed)
      return processSDHMEvents(processedEvents, city);
    } else {
      // Client-side: This shouldn't happen in normal usage, but handle gracefully
      console.warn(
        "getSDHMEvents called from client-side - this may not work due to authentication requirements"
      );

      const protocol = window.location.protocol;
      const host = window.location.host;
      const apiUrl = `${protocol}//${host}/api/sdhm/${locationId}/${city}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error(`SDHM API error: ${response.status}`);
        return [];
      }

      const data = await response.json();

      // Events are already processed on the API side
      const processedEvents = data.data || [];

      // Use the wrapper function for consistency (events already processed)
      return processSDHMEvents(processedEvents, city);
    }
  } catch (error) {
    console.error("Error fetching SDHM events:", error);
    return [];
  }
};

/**
 * Frontend-safe version of getSDHMEvents that uses the proxy endpoint
 * @param {number} locationId - Location ID
 * @param {string} city - City name
 * @returns {Promise<Array>} - Processed events array
 */
export const getSDHMEventsClient = async (locationId, city) => {
  try {
    const protocol =
      typeof window !== "undefined" ? window.location.protocol : "http:";
    const host =
      typeof window !== "undefined" ? window.location.host : "localhost:3000";
    const apiUrl = `${protocol}//${host}/api/frontend/events/${locationId}/${encodeURIComponent(
      city
    )}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Frontend events API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Events are already processed on the API side
    const processedEvents = data.data || [];

    // Use the wrapper function for consistency (events already processed)
    return processSDHMEvents(processedEvents, city);
  } catch (error) {
    console.error("Error fetching SDHM events from frontend:", error);
    return [];
  }
};

// !TODO - THIS CAN ALL BE REMOVED SOON
/**
 * Retrieves data from multiple event APIs
 * @param {number} id - City or State ID
 * @param {string} city - City name
 * @returns {Promise<Array>} - Events data
 */
const getEvents = async (id, city) => {
  try {
    // Define data sources
    const dataSources = [
      () => fetchEDMTrainData(id),
      () => fetchTicketMasterData(city),
      // Add more data sources here in the future
      // () => fetchEventbriteData(city),
      // () => fetchBandsInTownData(city),
    ];

    // Fetch data from all sources
    const dataResults = await Promise.all(
      dataSources.map(async (fetchFunction) => {
        try {
          return await fetchFunction();
        } catch (error) {
          console.error("Error fetching from data source:", error);
          return [];
        }
      })
    );

    // Combine all events
    const combinedEvents = dataResults.flat();

    // Remove duplicates, sort by date, and return parsed data
    const uniqueEvents = removeDuplicateEvents(combinedEvents);
    const sortedEvents = sortEventsByDate(uniqueEvents);
    return parseData(sortedEvents); // need to refator this and remove this
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Fetch and format EDMTrain API data
 * @param {number} id - City or State ID
 * @returns {Promise<Array>} - Formatted events array
 */
const fetchEDMTrainData = async (id) => {
  try {
    // Check if we're running on the server-side
    const isServerSide = typeof window === "undefined";

    if (isServerSide) {
      // Server-side: Use authenticated fetch
      const apiUrl = `/api/events/${id}`;
      const data = await authenticatedFetch(apiUrl);
      return formatEDMTrainEvents(data);
    } else {
      // Client-side: Use regular fetch with base URL
      const EDMTrainApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`;

      const response = await fetch(EDMTrainApiUrl);
      if (!response.ok) {
        console.error(`EDMTrain API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return formatEDMTrainEvents(data);
    }
  } catch (error) {
    console.error("Error fetching EDMTrain data:", error);
    return [];
  }
};

/**
 * Fetch and format TicketMaster API data
 * @param {string} city - City name
 * @returns {Promise<Array>} - Formatted events array
 */
const fetchTicketMasterData = async (city) => {
  try {
    // Check if we're running on the server-side
    const isServerSide = typeof window === "undefined";

    if (isServerSide) {
      // Server-side: Use authenticated fetch
      const apiUrl = `/api/ticketmaster/events/${encodeURIComponent(city)}`;
      const data = await authenticatedFetch(apiUrl);
      return formatTicketMasterEvents(data);
    } else {
      // Client-side: Use regular fetch with base URL
      const ticketMasterApiUrl = `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/ticketmaster/events/${encodeURIComponent(city)}`;

      const response = await fetch(ticketMasterApiUrl);
      if (!response.ok) {
        console.error(`TicketMaster API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return formatTicketMasterEvents(data);
    }
  } catch (error) {
    console.error("Error fetching TicketMaster data:", error);
    return [];
  }
};

/**
 * Format EDMTrain API response into standardized event format
 * @param {Object} apiData - Raw EDMTrain API response
 * @returns {Array} - Formatted events array
 */
const formatEDMTrainEvents = (apiData) => {
  if (!apiData?.data || !Array.isArray(apiData.data)) {
    return [];
  }

  return apiData.data.map((event) => ({
    ...event,
    eventSource: "edmtrain.com",
    isVisible: true,
  }));
};

/**
 * Format TicketMaster API response into standardized event format
 * @param {Object} apiData - Raw TicketMaster API response
 * @returns {Array} - Formatted events array
 */
const formatTicketMasterEvents = (apiData) => {
  if (!apiData?._embedded?.events || !Array.isArray(apiData._embedded.events)) {
    return [];
  }

  return apiData._embedded.events
    .map((event) => {
      // Try to get the best image with multiple fallback options
      let imageUrl = null;

      if (event.images && event.images.length > 0) {
        // Priority order: 4_3 ratio, then 3_2, then 16_9, then any available
        const preferredRatios = ["4_3", "3_2", "16_9"];

        for (const ratio of preferredRatios) {
          const image = event.images.find((img) => img.ratio === ratio);
          if (image) {
            imageUrl = image.url;
            break;
          }
        }

        // If no preferred ratio found, use the first available image
        if (!imageUrl && event.images[0]) {
          imageUrl = event.images[0].url;
        }
      }

      const venue = event._embedded?.venues?.[0];

      // Skip events without proper venue data
      if (!venue) return null;

      // Handle artistList - if no attractions but has event name, use event name as artist
      let artistList = [];
      let eventName = event.name;

      if (
        event._embedded?.attractions &&
        event._embedded.attractions.length > 0
      ) {
        artistList = event._embedded.attractions.map((attraction) => ({
          name: attraction.name,
        }));
      } else if (event.name) {
        // If no attractions but has event name, use event name as the artist and remove event name
        artistList = [{ name: event.name }];
        eventName = event.promoter?.name || event.name; // Remove the event name
      }

      return {
        id: event.id, // Add the Ticketmaster event ID
        date: event.dates?.start?.localDate,
        artistList: artistList,
        name: eventName,
        venue: {
          name: venue.name,
          address: `${venue.address?.line1 || ""}, ${venue.city?.name || ""}, ${
            venue.state?.stateCode || ""
          }, ${venue.postalCode || ""}, ${venue.country?.countryCode || ""}`,
        },
        link: event.url
          ? event.url.replace("sandiegohousemusic", "5926009")
          : event.url,
        isVisible: true,
        eventSource: "Ticketmaster",
        imageUrl: imageUrl,
      };
    })
    .filter((event) => event !== null);
};

/**
 * Format TicketMaster API response into standardized event format
 * @param {Object} apiData - Raw TicketMaster API response
 * @returns {Array} - Formatted events array
 */
export const formatTicketMasterwithImagesArtists = (events) => {
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
 * Calculate similarity between two strings using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
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
export const removeDuplicateEvents = (events, city = "") => {
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
export const sortEventsByDate = (events) => {
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
export const filterPastEvents = (events) => {
  const todayString = toDateString(new Date());

  return events.filter((event) => {
    if (!event.date) return false;
    return toDateString(event.date) >= todayString;
  });
};

/**
 * Parse and format events data for display
 * @param {Array} data - Array of events
 * @returns {Array} - Formatted events array
 */
export const parseData = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    // sets all to be visible
    item.isVisible = true;
    // add a formatted date for Search
    item.formattedDate = setDates(item.date).dayMonthYear;

    return item;
  });
};

export default getEvents;
