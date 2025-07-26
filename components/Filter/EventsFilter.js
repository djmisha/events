import {
  makeVenues,
  makeArtists,
  makeDates,
  makePromoters,
  makeVenuesWithCounts,
  makeDatesWithCounts,
  makePromotersWithCounts,
} from "../../utils/utilities";
import NavItem from "../Navigation/NavItem";
import BackToTop from "../BackToTop/BackToTop";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaFilter,
  FaBullhorn,
} from "react-icons/fa";
import { useState } from "react";
import MenuOverlay from "../ui/MenuOverlay";
import MenuList from "../Navigation/MenuList";

const EventsFilter = ({ events, setSearchTerm }) => {
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isVenueMenuOpen, setIsVenueMenuOpen] = useState(false);
  const [isArtistMenuOpen, setIsArtistMenuOpen] = useState(false);
  const [isPromoterMenuOpen, setIsPromoterMenuOpen] = useState(false);

  const venues = makeVenues(events ?? []);
  const dates = makeDates(events ?? []);
  const artists = makeArtists(events ?? []);
  const promoters = makePromoters(events ?? []);

  // Get items with counts for display
  const venuesWithCounts = makeVenuesWithCounts(events ?? []);
  const datesWithCounts = makeDatesWithCounts(events ?? []);
  const promotersWithCounts = makePromotersWithCounts(events ?? []);

  // Calculate statistics from events data
  const getStatistics = () => {
    if (!events || events.length === 0) {
      return {
        totalEvents: 0,
        totalVenues: 0,
        totalArtists: 0,
        totalPromoters: 0,
      };
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
      totalPromoters: promoters.length,
    };
  };

  const { totalEvents, totalVenues, totalArtists, totalPromoters } =
    getStatistics();

  return (
    <div className="h-15 w-[calc(100%-20px)] relative bg-white z-10 m-2.5 mb-5 md:h-16">
      <div className="text-lg font-semibold flex flex-nowrap items-center justify-around relative left-0 z-[800] h-15 pb-0 bg-white w-full border-none md:h-12 md:justify-center md:m-0">
        <div className="border border-light-grey w-32 uppercase bg-white text-black px-4 flex items-center gap-2 text-xs font-semibold tracking-wide hidden md:flex h-12">
          <FaFilter className="text-xs text-black/60" />
          <span className="whitespace-nowrap">Filter By</span>
        </div>
        <div className="flex gap-1 w-full mx-auto justify-between md:gap-4">
          <div className="flex-1 flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-1 px-1 py-9 h-20 bg-white rounded-lg shadow-[0_4px_16px_0_rgba(233,30,99,0.15)] border-2 border-pink/40 transition-all duration-200 w-full cursor-pointer hover:-translate-y-px hover:shadow-[0_6px_20px_0_rgba(233,30,99,0.25)] active:translate-y-0 text-center justify-center md:flex-row md:gap-3 md:py-6 md:px-4 md:h-16 md:items-center md:text-left md:shadow-[0_4px_16px_0_rgba(233,30,99,0.20)] md:hover:shadow-[0_6px_20px_0_rgba(233,30,99,0.30)] md:border-2 md:border-pink/50"
              onClick={() => setIsDateMenuOpen(true)}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-all duration-200 bg-pink md:w-10 md:h-10 hover:scale-105">
                <FaCalendarAlt className="text-xs text-white md:text-sm" />
              </div>
              <div className="flex flex-col gap-0 min-w-0 flex-1 md:gap-0">
                <div className="text-xs leading-tight text-black transition-colors duration-200 md:text-xl md:font-bold md:leading-tight">
                  {totalEvents.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-black/70 uppercase tracking-wide leading-tight md:text-sm md:tracking-normal md:text-gray-600 md:leading-tight">
                  {totalEvents === 1 ? "Date" : "Dates"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isDateMenuOpen}
              onClose={() => setIsDateMenuOpen(false)}
            >
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <h2 className="m-0 mb-4 text-xl font-semibold text-black">
                  Dates
                </h2>
                <MenuList
                  navItems={dates}
                  navItemsWithCounts={datesWithCounts}
                  text="date"
                  isOpen={isDateMenuOpen}
                  title="Dates"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsDateMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-1 px-1 py-9 h-20 bg-white rounded-lg shadow-[0_4px_16px_0_rgba(25,198,230,0.15)] border-2 border-blue/40 transition-all duration-200 w-full cursor-pointer hover:-translate-y-px hover:shadow-[0_6px_20px_0_rgba(25,198,230,0.25)] active:translate-y-0 text-center justify-center md:flex-row md:gap-3 md:py-6 md:px-4 md:h-16 md:items-center md:text-left md:shadow-[0_4px_16px_0_rgba(25,198,230,0.20)] md:hover:shadow-[0_6px_20px_0_rgba(25,198,230,0.30)] md:border-2 md:border-blue/50"
              onClick={() => setIsVenueMenuOpen(true)}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-all duration-200 bg-blue md:w-10 md:h-10 hover:scale-105">
                <FaMapMarkerAlt className="text-xs text-white md:text-sm" />
              </div>
              <div className="flex flex-col gap-0 min-w-0 flex-1 md:gap-0">
                <div className="text-xs leading-tight text-black transition-colors duration-200 md:text-xl md:font-bold md:leading-tight">
                  {totalVenues.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-black/70 uppercase tracking-wide leading-tight md:text-sm md:tracking-normal md:text-gray-600 md:leading-tight">
                  {totalVenues === 1 ? "Venue" : "Venues"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isVenueMenuOpen}
              onClose={() => setIsVenueMenuOpen(false)}
            >
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <h2 className="m-0 mb-4 text-xl font-semibold text-black">
                  Venues
                </h2>
                <MenuList
                  navItems={venues}
                  navItemsWithCounts={venuesWithCounts}
                  text="venue"
                  isOpen={isVenueMenuOpen}
                  title="Venues"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsVenueMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-1 px-1 py-9 h-20 bg-white rounded-lg shadow-[0_4px_16px_0_rgba(255,152,0,0.15)] border-2 border-orange/40 transition-all duration-200 w-full cursor-pointer hover:-translate-y-px hover:shadow-[0_6px_20px_0_rgba(255,152,0,0.25)] active:translate-y-0 text-center justify-center md:flex-row md:gap-3 md:py-6 md:px-4 md:h-16 md:items-center md:text-left md:shadow-[0_4px_16px_0_rgba(255,152,0,0.20)] md:hover:shadow-[0_6px_20px_0_rgba(255,152,0,0.30)] md:border-2 md:border-orange/50"
              onClick={() => setIsArtistMenuOpen(true)}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-all duration-200 bg-orange md:w-10 md:h-10 hover:scale-105">
                <FaUsers className="text-xs text-white md:text-sm" />
              </div>
              <div className="flex flex-col gap-0 min-w-0 flex-1 md:gap-0">
                <div className="text-xs leading-tight text-black transition-colors duration-200 md:text-xl md:font-bold md:leading-tight">
                  {totalArtists.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-black/70 uppercase tracking-wide leading-tight md:text-sm md:tracking-normal md:text-gray-600 md:leading-tight">
                  {totalArtists === 1 ? "Artist" : "Artists"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isArtistMenuOpen}
              onClose={() => setIsArtistMenuOpen(false)}
            >
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <h2 className="m-0 mb-4 text-xl font-semibold text-black">
                  DJs and Artists
                </h2>
                <MenuList
                  navItems={artists}
                  text="artist"
                  isOpen={isArtistMenuOpen}
                  title="DJ's and Artists"
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsArtistMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-1 px-1 py-9 h-20 bg-white rounded-lg shadow-[0_4px_16px_0_rgba(0,191,165,0.15)] border-2 border-green/40 transition-all duration-200 w-full cursor-pointer hover:-translate-y-px hover:shadow-[0_6px_20px_0_rgba(0,191,165,0.25)] active:translate-y-0 text-center justify-center md:flex-row md:gap-3 md:py-6 md:px-4 md:h-16 md:items-center md:text-left md:shadow-[0_4px_16px_0_rgba(0,191,165,0.20)] md:hover:shadow-[0_6px_20px_0_rgba(0,191,165,0.30)] md:border-2 md:border-green/50"
              onClick={() => setIsPromoterMenuOpen(true)}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-all duration-200 bg-green md:w-10 md:h-10 hover:scale-105">
                <FaBullhorn className="text-xs text-white md:text-sm" />
              </div>
              <div className="flex flex-col gap-0 min-w-0 flex-1 md:gap-0">
                <div className="text-xs leading-tight text-black transition-colors duration-200 md:text-xl md:font-bold md:leading-tight">
                  {totalPromoters.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-black/70 uppercase tracking-wide leading-tight md:text-sm md:tracking-normal md:text-gray-600 md:leading-tight">
                  {totalPromoters === 1 ? "Promoter" : "Promoters"}
                </div>
              </div>
            </div>
            <MenuOverlay
              isOpen={isPromoterMenuOpen}
              onClose={() => setIsPromoterMenuOpen(false)}
            >
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <MenuList
                  navItems={promoters.map((p) => p.name || p)}
                  navItemsWithCounts={promotersWithCounts}
                  text="promoter"
                  title="Promoters"
                  isOpen={isPromoterMenuOpen}
                  setSearchTerm={setSearchTerm}
                  onClose={() => setIsPromoterMenuOpen(false)}
                />
              </div>
            </MenuOverlay>
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default EventsFilter;
