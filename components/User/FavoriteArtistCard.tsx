import Link from "next/link";
import { FaTicketAlt, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import FavoriteArtistImage from "./FavoriteArtistImage";
import { ToSlugArtist } from "../../utils/utilities";

interface Artist {
  id: string;
  name: string;
  count?: number;
  locations?: number;
  arrayIndex?: number;
}

interface FavoriteArtistCardProps {
  artist: Artist;
  isEditing: boolean;
  onRemove: (arrayIndex: number) => void;
  disableLinks?: boolean;
}

const FavoriteArtistCard = ({
  artist,
  isEditing,
  onRemove,
  disableLinks,
}: FavoriteArtistCardProps) => {
  const { id, name, count, locations, arrayIndex } = artist;
  const showCounts = !!(count && locations);

  const content = (
    <div className="flex justify-between items-center bg-gray-100 rounded-lg p-2.5 mb-3 shadow-md relative h-20">
      <div className="flex items-center w-full">
        <div className="w-15 h-15 flex-shrink-0 mr-4 overflow-hidden rounded">
          <FavoriteArtistImage id={id} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-base mb-1">{name}</div>
          {showCounts && (
            <div className="flex gap-4 text-xs text-gray-600">
              <div className="flex items-center">
                <FaTicketAlt className="mr-1.5 text-xs" />
                <span>{count} shows</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-1.5 text-xs" />
                <span>{locations} cities</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isEditing) {
    return (
      <>
        {content}
        {isEditing && arrayIndex !== undefined && (
          <button
            className="bg-red-500 text-white border-0 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-red-400"
            onClick={() => onRemove(arrayIndex)}
            aria-label="Remove artist"
          >
            <FaTimes />
          </button>
        )}
      </>
    );
  }

  return disableLinks ? (
    content
  ) : (
    <Link
      href={`/artist/${ToSlugArtist(name)}`}
      className="flex-1 no-underline text-current"
    >
      {content}
    </Link>
  );
};

export default FavoriteArtistCard;
