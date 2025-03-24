import Link from "next/link";
import { FaTicketAlt, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import FavoriteArtistImage from "./FavoriteArtistImage";
import { ToSlugArtist } from "../../utils/utilities";
import styles from "./FavoriteArtistCard.module.scss";

interface Artist {
  id: string;
  name: string;
  count?: number;
  locations?: number;
  arrayIndex?: number;
}

interface FavoriteArtistCardProps {
  artist: Artist;
  isEditing: boolean;
  onRemove: (arrayIndex: number) => void;
}

const FavoriteArtistCard = ({
  artist,
  isEditing,
  onRemove,
}: FavoriteArtistCardProps) => {
  const { id, name, count, locations, arrayIndex } = artist;
  const showCounts = !!(count && locations);

  return (
    <div className={styles.favoriteArtistCard}>
      <Link
        href={`/artist/${ToSlugArtist(name)}`}
        className={styles.artistLink}
      >
        <div className={styles.artistContent}>
          <div className={styles.imageContainer}>
            <FavoriteArtistImage id={id} />
          </div>
          <div className={styles.artistInfo}>
            <div className={styles.artistName}>{name}</div>
            {showCounts && (
              <div className={styles.artistCounts}>
                <div className={styles.countItem}>
                  <FaTicketAlt className={styles.icon} />
                  <span>{count} shows</span>
                </div>
                <div className={styles.countItem}>
                  <FaMapMarkerAlt className={styles.icon} />
                  <span>{locations} cities</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
      {isEditing && arrayIndex !== undefined && (
        <button
          className={styles.removeButton}
          onClick={() => onRemove(arrayIndex)}
          aria-label="Remove artist"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default FavoriteArtistCard;
