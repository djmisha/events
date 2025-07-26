import { formatBio } from "./ArtistBio.helpers";

const saveTags = async (tags) => {
  // Save tags to the database or API
  // removing for now to save function requests
  // most tags are already saved in the database
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

  // if (hasTags) saveTags(tags);

  return (
    <div className="px-2.5 max-w-3xl mx-auto [&_p]:text-md text-left">
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
          <div className="[&_span]:py-1 [&_span]:px-4 [&_span]:m-1 [&_span]:border [&_span]:border-blue [&_span]:rounded-2xl [&_span]:text-xs [&_span]:text-center [&_span]:inline-block [&_span]:bg-blue [&_span]:text-white">
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
