import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import styles from "./FavoriteArtists.module.scss";
import artistsData from "../../localArtistsDB.json";
import TopArtistsCard from "../TopArtistsCard/TopArtistsCard";

interface Artist {
  id: string;
  name: string;
  count?: number;
  locations?: number;
}

interface FavoriteArtistsProps {
  userId: string;
}

const FavoriteArtists = ({ userId }: FavoriteArtistsProps) => {
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useContext(AppContext);

  useEffect(() => {
    const fetchFavoriteArtists = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        // Get the user's profile with favorite artist ids
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("favorite_artists")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching favorite artists:", error);
          return;
        }

        // Convert array indices to artist objects
        if (profile?.favorite_artists?.length) {
          const favArtists = profile.favorite_artists
            .map((index: number) => artistsData[index])
            .filter(Boolean);

          setFavoriteArtists(favArtists);
        }
      } catch (error) {
        console.error("Error in favorite artists fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteArtists();
  }, [supabase, userId]);

  if (loading) {
    return (
      <div className={styles.loading}>Loading your favorite artists...</div>
    );
  }

  if (!favoriteArtists.length) {
    return (
      <div className={styles.noFavorites}>
        <h3>Your Favorite Artists</h3>
        <p>You have not added any favorite artists yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.favoritesContainer}>
      <h3>Your Favorite Artists</h3>
      <div className={styles.artistsGrid}>
        {favoriteArtists.map((artist) => (
          <TopArtistsCard
            key={artist.id}
            artist={artist}
            showCounts={!!(artist.count && artist.locations)}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteArtists;
