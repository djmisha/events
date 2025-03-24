import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import styles from "./FavoriteArtists.module.scss";
import artistsData from "../../localArtistsDB.json";
import FavoriteArtistCard from "./FavoriteArtistCard";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Artist {
  id: string;
  name: string;
  count?: number;
  locations?: number;
  arrayIndex?: number;
}

interface FavoriteArtistsProps {
  userId: string;
}

const FavoriteArtists = ({ userId }: FavoriteArtistsProps) => {
  const [favoriteArtists, setFavoriteArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { supabase } = useContext(AppContext);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Listen for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Fetch favorite artists
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
            .map((index: number) => {
              const artist = artistsData[index];
              if (!artist) return null;
              return {
                ...artist,
                id: String(artist.id),
                arrayIndex: index,
              };
            })
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

  // Manual drag-and-drop functionality
  const handleDragStart = (index: number) => {
    if (!isEditing) return;
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || !isEditing) return;

    // If we're not dragging over a different item, do nothing
    if (draggedItem === index) return;

    // Reorder the list
    const newItems = [...favoriteArtists];
    const draggedItemContent = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, draggedItemContent);

    setFavoriteArtists(newItems);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null || !isEditing) return;

    // Save the new order to Supabase
    saveArtistOrder(favoriteArtists);
    setDraggedItem(null);
  };

  // Function to move artist up in the list
  const moveArtistUp = (index: number) => {
    if (index === 0) return; // Already at the top

    const newItems = [...favoriteArtists];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;

    setFavoriteArtists(newItems);

    // Save the new order to Supabase
    saveArtistOrder(newItems);
  };

  // Function to move artist down in the list
  const moveArtistDown = (index: number) => {
    if (index === favoriteArtists.length - 1) return; // Already at the bottom

    const newItems = [...favoriteArtists];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;

    setFavoriteArtists(newItems);

    // Save the new order to Supabase
    saveArtistOrder(newItems);
  };

  // Common function to save artist order to Supabase
  const saveArtistOrder = async (artists: Artist[]) => {
    try {
      const updatedFavorites = artists.map((artist) => artist.arrayIndex);

      const { error } = await supabase
        .from("profiles")
        .update({ favorite_artists: updatedFavorites })
        .eq("id", userId);

      if (error) {
        console.error("Error updating favorites order:", error);
      }
    } catch (error) {
      console.error("Error saving artist order:", error);
    }
  };

  // Get instructions message for edit mode
  const getInstructions = () => {
    if (isEditing) {
      return (
        <div className={styles.editInstructions}>
          {isMobile
            ? "Tap and hold to drag artists and reorder them"
            : "Drag artists to reorder them or tap the remove button to delete"}
        </div>
      );
    }
    return null;
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
        <h2>Your Favorite Artists</h2>
        <button
          className={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      {getInstructions()}

      <div className={styles.artistsList}>
        {favoriteArtists.map((artist, index) => (
          <div
            key={`artist-${artist.arrayIndex || index}`}
            className={`${styles.artistCardWrapper} ${
              isEditing ? styles.draggable : ""
            } ${draggedItem === index ? styles.dragging : ""}`}
            draggable={isEditing}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            data-is-editing={isEditing}
          >
            <FavoriteArtistCard
              artist={artist}
              isEditing={isEditing}
              onRemove={removeArtist}
              disableLinks={isEditing}
            />
            {isEditing && isMobile && (
              <div className={styles.mobileControls}>
                <button
                  className={`${styles.mobileButton} ${styles.upButton}`}
                  onClick={() => moveArtistUp(index)}
                  disabled={index === 0}
                  aria-label="Move artist up"
                >
                  <FaArrowUp />
                </button>
                <button
                  className={`${styles.mobileButton} ${styles.downButton}`}
                  onClick={() => moveArtistDown(index)}
                  disabled={index === favoriteArtists.length - 1}
                  aria-label="Move artist down"
                >
                  <FaArrowDown />
                </button>
              </div>
            )}
            {isEditing && !isMobile && (
              <div className={styles.dragHandle} aria-hidden="true">
                <span>⋮⋮</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteArtists;
