import setDates from "./setDates";

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

    // Remove duplicates and return parsed data
    const uniqueEvents = removeDuplicateEvents(combinedEvents);
    return parseData(uniqueEvents);
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
  const EDMTrainApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`;

  try {
    const response = await fetch(EDMTrainApiUrl);

    if (!response.ok) {
      console.error(`EDMTrain API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return formatEDMTrainEvents(data);
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
  const ticketMasterApiUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/ticketmaster/events/${encodeURIComponent(city)}`;

  try {
    const response = await fetch(ticketMasterApiUrl);

    if (!response.ok) {
      console.error(`TicketMaster API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return formatTicketMasterEvents(data);
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

      return {
        id: event.id, // Add the Ticketmaster event ID
        date: event.dates?.start?.localDate,
        artistList:
          event._embedded?.attractions?.map((attraction) => ({
            name: attraction.name,
          })) || [],
        name: event.name,
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
 * Remove duplicate events based on date and venue
 * @param {Array} events - Array of events
 * @returns {Array} - Array with duplicates removed
 */
const removeDuplicateEvents = (events) => {
  return events.reduce((acc, event) => {
    const duplicateIndex = acc.findIndex(
      (e) => e.date === event.date && e.venue?.name === event.venue?.name
    );

    if (duplicateIndex !== -1) {
      // Prefer TicketMaster data over other sources
      if (event.eventSource === "Ticketmaster") {
        acc[duplicateIndex] = event;
      }
    } else {
      acc.push(event);
    }

    return acc;
  }, []);
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

// Legacy function for backward compatibility
export const getEventsHome = async (id, setEvents, setLoading) => {
  const PATH = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`;

  await fetch(PATH, { mode: "cors" })
    .then(function (response) {
      response.json().then((res) => {
        parseData(res.data);
        setEvents(res.data);
        setLoading(false);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
};
