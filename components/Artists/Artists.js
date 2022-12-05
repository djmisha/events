import React from "react";

const Artists = ({ data }) => {
  let artists = [];
  data.map((artist, index) => {
    const artistEl = (
      <div className="artist" key={index}>
        {artist.name}
      </div>
    );
    artists.push(artistEl);
  });
  return artists;
};

export default Artists;
