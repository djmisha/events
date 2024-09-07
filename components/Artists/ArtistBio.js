import { useState, useEffect } from "react";
import { lastFMUrl, formatBio } from "./ArtistBio.helpers";

const ArtistBio = ({ name }) => {
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const getBio = async () => {
      const apiResponse = await fetch(lastFMUrl(name));
      const json = await apiResponse.json();
      const text = formatBio(json.artist.bio.content);
      const tags = json.artist.tags.tag;
      setBio(text);
      setTags(tags);
    };
    getBio();
  }, [name]);

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
