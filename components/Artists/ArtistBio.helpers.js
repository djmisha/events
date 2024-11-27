export const formatBio = (bio) => {
  if (!bio) return "";
  let clean = bio
    .replace(/<a\b[^>]*>(.*?)<\/a>./i, "")
    .replace(/\n/g, "<br>")
    .replace(
      "User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.",
      ""
    );
  return clean;
};
