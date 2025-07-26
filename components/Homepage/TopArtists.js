import { useState, useEffect, useRef } from "react";
import { shuffleArray, filterSurpriseGuest } from "../../utils/utilities";
import TopArtistsCard from "../TopArtistsCard/TopArtistsCard";
import Button from "../Button/Button";
import ButtonWrapper from "../Button/ButtonWrapper";

const TopArtists = () => {
  const [randomArtists, setRandomArtists] = useState([]);
  const [artists, setArtists] = useState([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchArtists = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        console.error(
          "NEXT_PUBLIC_BASE_URL is not set in your environment variables."
        );
        return;
      }
      console.log(
        "Fetching artists from:",
        `${baseUrl}/api/supabase/gettopartists`
      );

      const res = await fetch(`${baseUrl}/api/supabase/gettopartists`);
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
    setRandomArtists(shuffleArray(filterSurpriseGuest(artists)));
  }, [artists]);

  return (
    <>
      <h2 className="px-4">Top Touring Artists</h2>
      <p className="p-4">
        Discover our selection of top touring artists, ranked by their number of
        shows and city appearances. Click to learn more about each artist, read
        their bios, and explore upcoming events.
      </p>
      <div className="p-0 pb-10 transition-all duration-200 ease-out sm:px-3 sm:grid sm:grid-cols-2 sm:gap-4 md:mb-5 xl:grid-cols-3">
        {randomArtists?.map((artist, index) => {
          if (index >= 9) return null;
          return <TopArtistsCard key={artist.id} artist={artist} />;
        })}
      </div>
      <ButtonWrapper>
        <Button href="/artists" variant="primary">
          View More Top Touring Artists
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default TopArtists;
