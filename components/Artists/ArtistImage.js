import PropTypes from "prop-types";
import styles from "./ArtistImage.module.scss";

const ArtistImage = ({ id }) => {
  const url = id ? `/images/artists/${id}.jpg` : "/images/housemusic192.png";

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
};

export default ArtistImage;
