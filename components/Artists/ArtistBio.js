import { useState, useEffect } from "react";
import { lastFMUrl, formatBio } from "./ArtistBio.helpers";

const ArtistBio = ({ name }) => {
  const [bio, setBio] = useState("");

  useEffect(() => {
    const getBio = async () => {
      const apiResponse = await fetch(lastFMUrl(name));
      const json = await apiResponse.json();
      const text = formatBio(json.artist.bio.content);
      setBio(text);
    };
    getBio();
  }, [name]);

  return (
    bio && (
      <div className="artist-bio">
        <h2>About {name}</h2>
        <p
          className="artist-bio-text"
          dangerouslySetInnerHTML={{ __html: bio }}
        ></p>
      </div>
    )
  );
};

export default ArtistBio;
