import React from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

interface LocationCardProps {
  id: number;
  city: string;
  state: string;
  stateCode: string;
  slug: string;
  isDefault?: boolean;
  onRemove: (locationId: number) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  id,
  city,
  state,
  stateCode,
  slug,
  isDefault = false,
  onRemove,
}) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <div
      className={`flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[ease] mb-3 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 md:p-3 max-[480px]:p-3 ${
        isDefault
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white"
          : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="m-0 text-lg font-semibold text-gray-800 md:text-base max-[480px]:text-[0.95rem]">
          {city}, {stateCode}
        </h3>
        {isDefault && (
          <span className="text-xs text-blue-500 font-medium uppercase tracking-wider max-[480px]:text-[0.7rem]">
            Default
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-2">
        <Link
          href={`/${slug}`}
          className="text-blue-500 no-underline font-medium text-sm py-2 px-3 border border-blue-500 rounded transition-all duration-300 ease-[ease] whitespace-nowrap hover:bg-blue-500 hover:text-white md:text-[0.85rem] md:py-1.5 md:px-2.5 max-[480px]:text-xs max-[480px]:py-1.5 max-[480px]:px-2"
        >
          View Events
        </Link>
        <button
          onClick={handleRemove}
          className="bg-transparent border-none text-gray-500 cursor-pointer p-2 rounded transition-all duration-300 ease-[ease] flex items-center justify-center hover:bg-gray-100 hover:text-red-600 md:p-1.5 max-[480px]:p-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5 md:[&_svg]:w-3 md:[&_svg]:h-3 max-[480px]:[&_svg]:w-3 max-[480px]:[&_svg]:h-3"
          aria-label={`Remove ${city}, ${stateCode} from your locations`}
          title="Remove location"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
