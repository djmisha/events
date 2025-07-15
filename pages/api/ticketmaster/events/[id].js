/**
 * Ticketmaster API - City-specific Events
 * @param {*} req
 * @param {*} res - event data object
 */

export default async function handler(req, res) {
  const { id } = req.query;
  const KEY = process.env.API_KEY_TICKETMASTER;
  const genreId = "KnvZfZ7vAvF"; // Dance / Electronic genreId

  // Build URL with city parameter
  let URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${KEY}&genreId=${genreId}&city=${encodeURIComponent(
    id
  )}`;

  try {
    const apiResponse = await fetch(URL);

    // Check if the response is ok
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(
        `Ticketmaster API error: ${apiResponse.status} - ${apiResponse.statusText}`
      );
      console.error(`Error response:`, errorText.substring(0, 500));
      return res.status(200).json({ _embedded: { events: [] } });
    }

    const data = await apiResponse.json();

    // Check if the API returned an error or no events
    if (data.fault || !data._embedded || !data._embedded.events) {
      console.log(`No events found for city: ${id}`);
      return res.status(200).json({ _embedded: { events: [] } });
    }

    res.setHeader("Cache-Control", "s-maxage=86400"); // 1 day
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Ticketmaster events:", error);
    res.status(200).json({ _embedded: { events: [] } });
  }
}
