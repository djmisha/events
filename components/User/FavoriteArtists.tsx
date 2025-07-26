import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../features/AppContext";
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
        <div className="mb-3 p-2 bg-amber-50 border border-amber-300 rounded text-sm text-amber-800 text-center">
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
      <div className="p-8 text-center text-gray-500">
        Loading your favorite artists...
      </div>
    );
  }

  if (!favoriteArtists.length) {
    return (
      <div className="my-8 p-6 bg-gray-50 rounded-lg text-center text-gray-500">
        <h3 className="mb-4 text-2xl font-semibold text-gray-900">
          Your Favorite Artists
        </h3>
        <p>You have not added any favorite artists yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2>Your Favorite Artists</h2>
        <button
          className="py-1.5 px-3 bg-gray-100 border border-gray-300 rounded text-sm font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-200"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      {getInstructions()}

      <div className="flex flex-col gap-3 w-full py-2">
        {favoriteArtists.map((artist, index) => (
          <div
            key={`artist-${artist.arrayIndex || index}`}
            className={`items-center w-full relative p-1 rounded-md ${
              isEditing
                ? "cursor-grab transition-transform duration-200 select-none touch-none bg-gray-100 border border-dashed border-gray-300 rounded-lg hover:bg-gray-200"
                : ""
            } ${
              draggedItem === index
                ? "opacity-70 cursor-grabbing z-10 shadow-[0_5px_10px_rgba(0,0,0,0.15)] bg-gray-200 border-2 border-solid border-gray-400"
                : ""
            } ${
              isEditing
                ? "bg-gray-100 border border-dashed border-gray-300"
                : ""
            }`}
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
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[5]">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-gray-600 cursor-pointer transition-all duration-200 mb-1 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-gray-600"
                  onClick={() => moveArtistUp(index)}
                  disabled={index === 0}
                  aria-label="Move artist up"
                >
                  <FaArrowUp />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-gray-600 cursor-pointer transition-all duration-200 mt-1 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-gray-600"
                  onClick={() => moveArtistDown(index)}
                  disabled={index === favoriteArtists.length - 1}
                  aria-label="Move artist down"
                >
                  <FaArrowDown />
                </button>
              </div>
            )}
            {isEditing && !isMobile && (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg cursor-grab flex flex-col items-center p-2"
                aria-hidden="true"
              >
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
