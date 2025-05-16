import PropTypes from "prop-types";
import Image from "next/image";
import { useState } from "react";

const ArtistImage = ({ id }) => {
  const [imgError, setImgError] = useState(false);
  const url = id ? `/images/artists/${id}.jpg` : "/images/housemusic192.png";

  if (imgError) return null;

  return (
    <div className="artist-fallback">
      <Image
        className="artist-image"
        src={url}
        alt="Artist"
        width={200} // Adjust as needed for your layout
        height={200} // Adjust as needed for your layout
        loading="lazy"
        style={{ objectFit: "cover" }}
        onError={() => setImgError(true)}
      />
    </div>
  );
};

ArtistImage.propTypes = {
  id: PropTypes.number,
};

export default ArtistImage;
