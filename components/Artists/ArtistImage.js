import PropTypes from "prop-types";

const ArtistImage = ({ id }) => {
  const url = id ? `/images/artists/${id}.jpg` : "/images/artists/no-image.jpg";

  return (
    <div className="artist-fallback">
      <div
        className="artist-image"
        style={{
          backgroundImage: `url('${url}')`,
        }}
      ></div>
    </div>
  );
};

ArtistImage.propTypes = {
  id: PropTypes.string,
};

export default ArtistImage;
