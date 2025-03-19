import Link from "next/link";
import ArtistImage from "../Artists/ArtistImage";
import { ToSlugArtist } from "../../utils/utilities";
import { FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./TopArtistsCard.module.scss";

const TopArtistsCard = ({ artist, showCounts = true }) => {
  const { id, name, count, locations } = artist;

  return (
    <Link href={`/artist/${ToSlugArtist(name)}`}>
      <div className={styles.artistCard}>
        <ArtistImage id={id} />
        <div className={styles.artistInfo}>
          <div className={styles.artistName}>{name}</div>
          {showCounts && count && locations && (
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
  );
};

export default TopArtistsCard;
