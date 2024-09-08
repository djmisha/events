import { formatBio } from "./ArtistBio.helpers";

const ArtistBio = ({ lastFMDdata }) => {
  const bio = formatBio(lastFMDdata.artist.bio.content);
  const tags = lastFMDdata.artist.tags.tag;
  const name = lastFMDdata.artist.name;

  return (
    bio &&
    tags.length && (
      <div className="artist-bio">
        <h2>About {name}</h2>
        <p
          className="artist-bio-text"
          dangerouslySetInnerHTML={{ __html: bio }}
        ></p>
        <h3>{name} Music Styles</h3>
        <div className="artist-tags">
          {tags.map((tag) => (
            <span key={tag.name} className="artist-tag">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    )
  );
};

export default ArtistBio;
