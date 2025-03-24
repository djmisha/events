import React from "react";
import styles from "./FavoriteArtistImage.module.scss";

interface FavoriteArtistImageProps {
  id: string;
}

const FavoriteArtistImage: React.FC<FavoriteArtistImageProps> = ({ id }) => {
  const url = id ? `/images/artists/${id}.jpg` : "/images/housemusic192.png";

  return (
    <div className={styles.artistImageContainer}>
      <div
        className={styles.artistImage}
        style={{
          backgroundImage: `url('${url}')`,
        }}
      ></div>
    </div>
  );
};

export default FavoriteArtistImage;
