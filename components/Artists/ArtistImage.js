import { makeImageUrl } from "../../utils/utilities";

const ArtistImage = ({ name }) => {
  const url = name ? makeImageUrl(name) : makeImageUrl("no-image");
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

export default ArtistImage;
