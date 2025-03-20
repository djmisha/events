import { formatBio } from "./ArtistBio.helpers";
import { saveTagsToSupabase } from "../../api/saveTagsToSupabase";

const ArtistBio = ({ name, lastFMdata }) => {
  if (!lastFMdata || lastFMdata.error) return null;

  const bioContent = lastFMdata?.artist?.bio?.content;
  const tags = lastFMdata?.artist?.tags?.tag;
  const hasTags = Array.isArray(tags) && tags.length > 0;

  if (hasTags) saveTagsToSupabase(tags);

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
                {tag.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArtistBio;
