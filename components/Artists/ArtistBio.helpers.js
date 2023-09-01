const lastFMKEY = process.env.NEXT_PUBLIC_API_KEY_LASTFM;

export const lastFMUrl = (name) => {
  return `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=${lastFMKEY}&format=json`;
};

export const formatBio = (bio) => {
  let clean = bio
    .replace(/<a\b[^>]*>(.*?)<\/a>./i, "")
    .replace(/\n/g, "<br>")
    .replace(
      "User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.",
      ""
    );
  return clean;
};
