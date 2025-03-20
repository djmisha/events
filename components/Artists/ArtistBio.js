import { formatBio } from "./ArtistBio.helpers";

const saveTags = async (tags) => {
  try {
    const response = await fetch("/api/saveTags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      throw new Error("Failed to save tags");
    }
  } catch (error) {
    console.error("Error saving tags:", error);
  }
};

const ArtistBio = ({ name, lastFMdata }) => {
  if (!lastFMdata || lastFMdata.error) return null;

  const bioContent = lastFMdata?.artist?.bio?.content;
  const tags = lastFMdata?.artist?.tags?.tag;
  const hasTags = Array.isArray(tags) && tags.length > 0;

  if (hasTags) saveTags(tags);

  return (
    <div className="artist-bio">
      {bioContent && (
        <>
          <h2>About {name}</h2>
          <p
            className="artist-bio-text"
            dangerouslySetInnerHTML={{
              __html: formatBio(bioContent),
            }}
          />
        </>
      )}

      {hasTags && (
        <>
          <h3>{name} Music Style</h3>
          <div className="artist-tags">
            {tags.map((tag) => (
              <span key={tag.name} className="artist-tag">
                {tag.name.toLowerCase().replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArtistBio;
