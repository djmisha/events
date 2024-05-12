import React from "react";
import Link from "next/link";
import ArtistImage from "../Artists/ArtistImage";
import { ToSlugArtist } from "../../utils/utilities";

const TopArtists = ({ artists }) => {
  if (!artists || artists.length === 0) return null;

  return (
    <>
      <h2>Top Touring Artists</h2>
      <div className="top-artists-list">
        {artists.map((artist) => {
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
