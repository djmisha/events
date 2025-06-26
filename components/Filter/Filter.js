import { useEffect, useCallback } from "react";
import { clearSearch } from "../../utils/searchFilter";
import toast from "react-hot-toast";
import styles from "../ui/ToastProvider.module.scss";

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
  /**
   * Handles clearing the filter, updating events, and dismissing toast
   */
  const handleClearFilter = useCallback(() => {
    const newEvents = clearSearch(events);
    setEvents(newEvents);

    // Dismiss the toast
    toast.dismiss("filter-toast");

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
      toast.dismiss("filter-toast");

      // Show new toast with custom close button
      toast(
        (t) => (
          <div className={styles.filterToastContent}>
            <div className={styles.filterIcon}>{emoji}</div>
            <div className={styles.filterMessage}>
              {resultCount} {resultCount === 1 ? "result" : "results"} for{" "}
              <span className={styles.searchTerm}>{searchTerm}</span>
            </div>
            <button
              onClick={() => {
                handleClearFilter();
              }}
              title="Clear filter and show all events"
              className={styles.closeButton}
            >
              ✕
            </button>
          </div>
        ),
        {
          id: "filter-toast",
          duration: Infinity,
        }
      );
    } else if (!filterVisible) {
      // Dismiss toast when filter is not visible
      toast.dismiss("filter-toast");
    }
  }, [filterVisible, searchTerm, events, handleClearFilter]);

  // Clean up toast on component unmount
  useEffect(() => {
    return () => {
      toast.dismiss("filter-toast");
    };
  }, []);

  return null; // No longer rendering the original filter UI - everything is handled via toast
};

export default Filter;
