import React from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const CountBoxes = ({ events }) => {
  // Calculate statistics from events data
  const getStatistics = () => {
    if (!events || events.length === 0) {
      return { totalEvents: 0, totalVenues: 0, totalArtists: 0 };
    }

    // Get visible events (when filtering is active)
    const visibleEvents = events.filter((event) => event.isVisible !== false);

    // Count unique venues
    const uniqueVenues = new Set();
    const uniqueArtists = new Set();

    visibleEvents.forEach((event) => {
      // Count unique venues
      if (event.venue && event.venue.name) {
        uniqueVenues.add(event.venue.name);
      }

      // Count unique artists
      if (event.artistList && Array.isArray(event.artistList)) {
        event.artistList.forEach((artist) => {
          if (artist.name) {
            uniqueArtists.add(artist.name);
          }
        });
      }
    });

    return {
      totalEvents: visibleEvents.length,
      totalVenues: uniqueVenues.size,
      totalArtists: uniqueArtists.size,
    };
  };

  const { totalEvents, totalVenues, totalArtists } = getStatistics();

  const countItems = [
    {
      icon: FaCalendarAlt,
      count: totalEvents,
      label: totalEvents === 1 ? "Event" : "Events",
      color: "pink",
    },
    {
      icon: FaMapMarkerAlt,
      count: totalVenues,
      label: totalVenues === 1 ? "Venue" : "Venues",
      color: "blue",
    },
    {
      icon: FaUsers,
      count: totalArtists,
      label: totalArtists === 1 ? "Artist" : "Artists",
      color: "orange",
    },
  ];

  const getColorClasses = (color) => {
    const baseClasses =
      "flex items-center gap-3.5 md:gap-4 p-4 md:p-5 sm:px-4 sm:gap-3 bg-white rounded-lg shadow-md border-2 border-transparent transition-all duration-200 min-w-0 flex-1 md:flex-none md:min-w-45 max-sm:flex-1 max-sm:max-w-full hover:-translate-y-px hover:shadow-lg";

    switch (color) {
      case "pink":
        return `${baseClasses} hover:border-pink-500/40 [&_.icon-wrapper]:bg-gradient-to-br [&_.icon-wrapper]:from-pink-500 [&_.icon-wrapper]:to-pink-600 hover:[&_.icon-wrapper]:from-pink-600 hover:[&_.icon-wrapper]:to-pink-700 hover:[&_.icon-wrapper]:scale-105 hover:[&_.count]:text-pink-500`;
      case "blue":
        return `${baseClasses} hover:border-blue-500/40 [&_.icon-wrapper]:bg-gradient-to-br [&_.icon-wrapper]:from-blue-500 [&_.icon-wrapper]:to-blue-600 hover:[&_.icon-wrapper]:from-blue-600 hover:[&_.icon-wrapper]:to-blue-700 hover:[&_.icon-wrapper]:scale-105 hover:[&_.count]:text-blue-500`;
      case "orange":
        return `${baseClasses} hover:border-orange-500/40 [&_.icon-wrapper]:bg-gradient-to-br [&_.icon-wrapper]:from-orange-500 [&_.icon-wrapper]:to-orange-600 hover:[&_.icon-wrapper]:from-orange-600 hover:[&_.icon-wrapper]:to-orange-700 hover:[&_.icon-wrapper]:scale-105 hover:[&_.count]:text-orange-500`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="flex gap-4 md:gap-6 my-6 md:my-8 md:mb-10 px-3 flex-wrap justify-start">
      {countItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className={getColorClasses(item.color)}>
            <div className="icon-wrapper flex items-center justify-center w-12 h-12 md:w-14 md:h-14 max-sm:w-11 max-sm:h-11 rounded-full flex-shrink-0 transition-all duration-200">
              <IconComponent className="text-xl md:text-2xl max-sm:text-lg text-white" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="count text-2xl md:text-3xl max-sm:text-xl font-bold leading-tight text-black transition-colors duration-200">
                {item.count.toLocaleString()}
              </div>
              <div className="text-sm md:text-sm max-sm:text-xs font-medium text-black/70 uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountBoxes;
