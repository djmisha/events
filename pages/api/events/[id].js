/**
 * EDMtrain API
 * @param {*} req
 * @param {*} res - event data object
 */

export default async function handler(req, res) {
  const { id } = req.query;
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
  const URL = EDMURL + id + "&client=" + KEY;

  try {
    const apiResponse = await fetch(URL);
    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
    console.error(error);
  }
}
