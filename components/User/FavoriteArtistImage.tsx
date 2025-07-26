import React from "react";

interface FavoriteArtistImageProps {
  id: string;
}

const FavoriteArtistImage: React.FC<FavoriteArtistImageProps> = ({ id }) => {
  const url = id ? `/images/artists/${id}.jpg` : "/images/housemusic192.png";

  return (
    <div className="w-full h-full overflow-hidden rounded bg-gray-300">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-300 hover:scale-105"
        style={{
          backgroundImage: `url('${url}')`,
        }}
      ></div>
    </div>
  );
};

export default FavoriteArtistImage;
