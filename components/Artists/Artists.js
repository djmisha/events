import React from "react";
import styles from "./Artists.module.scss";

const Artists = ({ data }) => {
  let artists = [];
  data.map((artist, index) => {
    const artistEl = (
      <div className={styles.artist} key={index}>
        {artist.name}
      </div>
    );
    artists.push(artistEl);
  });
  return artists;
};

export default Artists;
