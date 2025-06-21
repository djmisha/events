import { updateDBEvents } from "../../../features/services/eventService";
import {
  checkNeedsUpdate,
  updateCacheTimestamp,
} from "../../../features/services/cacheService";

const CACHE_MAX_AGE = 21600; // 6 hours in seconds

export default async function handler(req, res) {
  const { id } = req.query;
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
  const URL = EDMURL + id + "&client=" + KEY;

  try {
    // Always fetch from EDMtrain
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();

    if (!data.data) {
      throw new Error("Invalid event data received");
    }

    // Check if we need to update the database

    // commenting this out as currently it is probably causing too many edge requests on vercel
    // think about an approach that does this work in the DB instead of on the server.

    // const needsUpdate = await checkNeedsUpdate(id);
    // if (needsUpdate) {
    //   console.log(`Updating database for location ${id}`);
    //   // Update database and cache timestamp in the background
    //   Promise.all([
    //     updateDBEvents(data.data, id),
    //     updateCacheTimestamp(id),
    //   ]).catch((error) => {
    //     console.error("Background update error:", error);
    //   });
    // }

    // Always return fresh API data
    res.setHeader(
      "Cache-Control",
      `s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`
    );
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: error.message });
  }
}
