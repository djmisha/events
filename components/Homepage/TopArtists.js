import React, { useState, useEffect } from "react";
import Link from "next/link";
import ArtistImage from "../Artists/ArtistImage";
import { ToSlugArtist, shuffleArray } from "../../utils/utilities";

const TopArtists = ({ artists }) => {
  const [randomArtists, setRandomArtists] = useState([]);

  useEffect(() => {
    setRandomArtists(shuffleArray(artists));
  }, [artists]);

  return (
    <>
      <h2>Top Touring Artists</h2>
      <div className="top-artists-list">
        {randomArtists?.map((artist) => {
          const { name, id, count } = artist;
          return (
            <Link href={`/artist/${ToSlugArtist(name)}`} key={id}>
              <div className="top-artists-single">
                <ArtistImage name={name} />
                <div className="top-artists-single-name">
                  {name} <span>{count} shows</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <button>
        <a href={`/artists`} className="secondary">
          More Top Touring Artists
        </a>
      </button>
    </>
  );
};

export default TopArtists;
