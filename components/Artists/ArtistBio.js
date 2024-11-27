import { useEffect, useRef, useState } from "react";
import { formatBio } from "./ArtistBio.helpers";

const ArtistBio = ({ name }) => {
  const [lastFMdata, setLastFMdata] = useState(undefined);
  const lastFMDataFetchedRef = useRef();

  const fetchLastFMData = async (url) => {
    try {
      const response = await fetch(url, { mode: "no-cors" });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // Fetches LastFM data for artist
  useEffect(() => {
    if (lastFMDataFetchedRef.current === name) return;
    lastFMDataFetchedRef.current = name;

    const setURL = (name) => {
      let url;

      if (process.env.NODE_ENV === "development") {
        url = `http://localhost:3000/api/lastfm/artistgetinfo/${name}`;
      } else {
        url = `https://www.sandiegohousemusic.com/api/lastfm/artistgetinfo/${name}`;
      }

      return url;
    };

    const url = setURL(name);

    fetchLastFMData(url)
      .then((data) => {
        setLastFMdata(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [name, lastFMdata]);

  return (
    lastFMdata &&
    !lastFMdata.error && (
      <div className="artist-bio">
        <h2>About {name}</h2>
        <p
          className="artist-bio-text"
          dangerouslySetInnerHTML={{
            __html: formatBio(lastFMdata?.artist?.bio?.content),
          }}
        ></p>
        <h3>{name} Music Style</h3>
        <div className="artist-tags">
          {lastFMdata?.artist?.tags?.tag?.map((tag) => (
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
