/**
 * Ticketmaster API
 * @param {*} req
 * @param {*} res - event data object
 */

export default async function handler(req, res) {
  const { id } = req.query;
  const KEY = process.env.NEXT_PUBLIC_API_KEY_TICKETMASTER;
  const genreId = "KnvZfZ7vAvF"; // Dance / Electronic genreId
  const URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${KEY}&genreId=${genreId}&${id}`;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();
    res.setHeader("Cache-Control", "s-maxage=86400"); // 1 day
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
    console.error(error);
  }
}
