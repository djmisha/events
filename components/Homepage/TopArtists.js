import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ArtistImage from "../Artists/ArtistImage";
import { ToSlugArtist, shuffleArray } from "../../utils/utilities";

const TopArtists = () => {
  const [randomArtists, setRandomArtists] = useState([]);
  const [artists, setArtists] = useState([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchArtists = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/supabase/gettopartists`
      );
      if (res.ok) {
        const data = await res.json();
        setArtists(data.data);
      } else {
        console.error("Error fetching data: ", res.status);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    setRandomArtists(shuffleArray(artists));
  }, [artists]);

  return (
    <>
      <h2>Top Touring Artists</h2>
      <div className="top-artists-list">
        {randomArtists?.map((artist) => {
          const { id, name, count, locations } = artist;

          return (
            <Link href={`/artist/${ToSlugArtist(name)}`} key={id}>
              <div className="top-artists-single">
                <ArtistImage id={id} />
                <div className="top-artists-single-name">
                  {name}
                  <div className="top-artists-single-counts">
                    <span>{count} shows</span>
                    <span>{locations} cities</span>
                  </div>
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
