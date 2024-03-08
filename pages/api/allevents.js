/**
 * EDMtrain API
 * get ALL events - returns a large object (4.2 mb +) so use carefully
 * @param {*} req
 * @param {*} res - event data object
 */

export default async function handler(req, res) {
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = "https://edmtrain.com/api/events?";
  const URL = EDMURL + "&client=" + KEY;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();
    res.setHeader("Cache-Control", "s-maxage=604800"); // cache for one week
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
    console.error(error);
  }
}

// removes the 4mb limit on api responses
export const config = {
  api: {
    responseLimit: false,
  },
};
