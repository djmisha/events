import PropTypes from "prop-types";
import styles from "./ArtistImage.module.scss";

const ArtistImage = ({ id, imageUrl }) => {
  // Use imageUrl if provided (for remote images like Ticketmaster)
  // Otherwise use the local image path with id (EDMTrain method)
  const url = imageUrl
    ? imageUrl
    : id
    ? `/images/artists/${id}.jpg`
    : "/images/housemusic192.png";

  return (
    <div className={styles.artistFallback}>
      <div
        className={styles.artistImage}
        style={{
          backgroundImage: `url('${url}')`,
        }}
      ></div>
    </div>
  );
};

ArtistImage.propTypes = {
  id: PropTypes.number,
  imageUrl: PropTypes.string,
};

export default ArtistImage;
