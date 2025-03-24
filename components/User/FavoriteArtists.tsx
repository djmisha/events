import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import styles from "./FavoriteArtists.module.scss";
import artistsData from "../../localArtistsDB.json";
import FavoriteArtistCard from "./FavoriteArtistCard";

interface Artist {
  id: string;
  name: string;
  count?: number;
  locations?: number;
  arrayIndex?: number; // Add arrayIndex property to fix the type error
}

interface FavoriteArtistsProps {
  userId: string;
}

const FavoriteArtists = ({ userId }: FavoriteArtistsProps) => {
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
            .map((index: number) => ({
              ...artistsData[index],
              arrayIndex: index, // Store the original index for later use
            }))
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

  const removeArtist = async (artistIndex: number) => {
    try {
      // Get current profile data
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("favorite_artists")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        return;
      }

      // Remove the artist from the array
      const updatedFavorites = profile.favorite_artists.filter(
        (index: number) => index !== artistIndex
      );

      // Update the database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ favorite_artists: updatedFavorites })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating favorites:", updateError);
        return;
      }

      // Update the local state
      setFavoriteArtists((prevArtists) =>
        prevArtists.filter((artist) => artist.arrayIndex !== artistIndex)
      );
    } catch (error) {
      console.error("Error removing artist:", error);
    }
  };

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
      <div className={styles.headerRow}>
        <h3>Your Favorite Artists</h3>
        <button
          className={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>
      <div className={styles.artistsList}>
        {favoriteArtists.map((artist) => (
          <div key={artist.id} className={styles.artistCardWrapper}>
            <FavoriteArtistCard
              artist={artist}
              isEditing={isEditing}
              onRemove={removeArtist}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteArtists;
