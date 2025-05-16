import PropTypes from "prop-types";
import Image from "next/image";
import { useState } from "react";

const fallbackUrl = "/images/housemusic192.png";

const ArtistImage = ({ id }) => {
  const [imgError, setImgError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const url = id && !imgError ? `/images/artists/${id}.jpg` : fallbackUrl;

  return (
    <div className="artist-fallback">
      <Image
        className="artist-image"
        src={url}
        alt="Artist"
        width={200}
        height={200}
        loading="lazy"
        style={{ objectFit: "cover" }}
        onError={() => {
          if (!imgError) {
            setImgError(true);
            setTriedFallback(true);
          } else {
            setTriedFallback(true);
          }
        }}
      />
    </div>
  );
};

ArtistImage.propTypes = {
  id: PropTypes.number,
};

export default ArtistImage;
