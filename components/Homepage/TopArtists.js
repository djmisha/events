import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ArtistImage from "../Artists/ArtistImage";
import { ToSlugArtist, shuffleArray } from "../../utils/utilities";
import TopArtistsCard from "../TopArtistsCard/TopArtistsCard";
import styles from "./TopArtists.module.scss";
import Button from "../Button/Button";
import buttonStyles from "../Button/Button.module.scss";

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
      <p>
        Discover our selection of top touring artists, ranked by their number of
        shows and city appearances. Click to learn more about each artist, read
        their bios, and explore upcoming events.
      </p>
      <div className={styles.artistsList}>
        {randomArtists?.map((artist) => (
          <TopArtistsCard key={artist.id} artist={artist} />
        ))}
      </div>
      <div className={buttonStyles.buttonWrapper}>
        <Button
          href="/artists"
          variant="secondary"
          className={styles.moreButton}
        >
          View More Top Touring Artists
        </Button>
      </div>
    </>
  );
};

export default TopArtists;
