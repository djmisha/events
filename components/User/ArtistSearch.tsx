import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import styles from "./ArtistSearch.module.scss";
import artistsData from "../../localArtistsDB.json";

interface Artist {
  name: string;
}

interface ArtistSearchProps {
  userId: string;
  onArtistAdded?: () => void;
}

const ArtistSearch = ({ userId, onArtistAdded }: ArtistSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    { artist: Artist; index: number }[]
  >([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { supabase } = useContext(AppContext);

  // Fetch current favorite artist ids
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("favorite_artists")
          .eq("id", userId)
          .single();

        if (!error && data?.favorite_artists) {
          setFavoriteIds(data.favorite_artists);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [supabase, userId]);

  // Handle search input changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = artistsData
      .map((artist, index) => ({ artist, index }))
      .filter(({ artist }) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10); // Limit to 10 results for performance

    setSearchResults(results);
  }, [searchTerm]);

  // Toggle artist favorite status
  const toggleFavorite = async (artistIndex: number) => {
    if (!userId) return;

    setLoading(true);
    try {
      let updatedFavorites: number[];

      if (favoriteIds.includes(artistIndex)) {
        // Remove from favorites
        updatedFavorites = favoriteIds.filter((id) => id !== artistIndex);
      } else {
        // Add to favorites
        updatedFavorites = [...favoriteIds, artistIndex];
      }

      // Update in database
      const { error } = await supabase
        .from("profiles")
        .update({ favorite_artists: updatedFavorites })
        .eq("id", userId);

      if (error) {
        setMessage({ type: "error", text: "Failed to update favorites." });
        console.error("Error updating favorites:", error);
        return;
      }

      // Update local state
      setFavoriteIds(updatedFavorites);
      setMessage({
        type: "success",
        text: favoriteIds.includes(artistIndex)
          ? "Removed from favorites!"
          : "Added to favorites!",
      });

      // Reset message after delay
      setTimeout(() => setMessage(null), 2000);

      // Call optional callback
      if (onArtistAdded) onArtistAdded();
    } catch (error) {
      console.error("Error in toggle favorite:", error);
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.artistSearchContainer}>
      <h3>Find Artists to Follow</h3>

      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for artists..."
          className={styles.searchInput}
        />
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.searchResults}>
        {searchResults.length > 0 ? (
          <ul className={styles.artistsList}>
            {searchResults.map(({ artist, index }) => (
              <li key={index} className={styles.artistItem}>
                <span className={styles.artistName}>{artist.name}</span>
                <button
                  onClick={() => toggleFavorite(index)}
                  disabled={loading}
                  className={`${styles.favoriteButton} ${
                    favoriteIds.includes(index) ? styles.favorited : ""
                  }`}
                >
                  {favoriteIds.includes(index)
                    ? "★ Favorited"
                    : "☆ Add to Favorites"}
                </button>
              </li>
            ))}
          </ul>
        ) : searchTerm.trim() !== "" ? (
          <p className={styles.noResults}>
            No artists found matching your search.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ArtistSearch;
