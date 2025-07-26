import { useEffect, useCallback, useRef } from "react";
import { clearSearch } from "../../utils/searchFilter";
import { toast } from "sonner";

/**
 * Filter component that displays persistent toast notifications for search results
 * instead of the traditional inline filter display.
 *
 * @param {Array} events - Array of events to filter
 * @param {Function} setEvents - Function to update events state
 * @param {string} searchTerm - Current search term being filtered
 * @param {boolean} filterVisible - Whether filter is currently active
 * @param {Function} setFilterVisible - Function to toggle filter visibility
 * @param {Function} onClearFilter - Optional custom clear handler for pagination
 */
const Filter = ({
  events,
  setEvents,
  searchTerm,
  filterVisible,
  setFilterVisible,
  onClearFilter,
}) => {
  const toastIdRef = useRef(null);

  /**
   * Handles clearing the filter, updating events, and dismissing toast
   */
  const handleClearFilter = useCallback(() => {
    const newEvents = clearSearch(events);
    setEvents(newEvents);

    // Dismiss the toast
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    // Use custom clear handler if provided (for pagination persistence)
    if (onClearFilter) {
      onClearFilter();
    } else {
      // Fallback to original behavior
      setFilterVisible(false);
      // Scroll to top when clearing filter to show paginated results from the beginning
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [events, setEvents, onClearFilter, setFilterVisible]);

  // Show toast when filter becomes visible
  useEffect(() => {
    if (filterVisible && searchTerm && events && events.length > 0) {
      const resultCount = events.filter(
        (event) => event.isVisible !== false
      ).length;

      // Add appropriate emoji based on result count
      let emoji = "🔍";
      if (resultCount === 0) {
        emoji = "😔";
      } else if (resultCount === 1) {
        emoji = "🎯";
      } else if (resultCount > 5) {
        emoji = "🎉";
      }

      // Dismiss any existing toast first
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }

      // Use setTimeout to ensure the dismissal is processed before creating new toast
      const timeoutId = setTimeout(() => {
        // Show new toast with wrapping text layout
        toastIdRef.current = toast(
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-full ">
            <div className="text-xl flex-shrink-0">{emoji}</div>
            <div className="flex-1 text-sm text-gray-700 break-words">
              {resultCount} {resultCount === 1 ? "result" : "results"} for{" "}
              <span className="font-semibold text-gray-900">{searchTerm}</span>
            </div>
            <button
              onClick={() => {
                handleClearFilter();
              }}
              title="Clear filter and show all events"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:opacity-80 transition-colors duration-200 font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: "#ce3197" }}
            >
              ✕
            </button>
          </div>,
          {
            duration: Infinity,
          }
        );
      }, 0);

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    } else if (!filterVisible) {
      // Dismiss toast when filter is not visible
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    }
  }, [filterVisible, searchTerm, events, handleClearFilter]);

  // Clean up toast on component unmount
  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, []);

  return null; // No longer rendering the original filter UI - everything is handled via toast
};

export default Filter;
