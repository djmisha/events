import { clearSearch } from "../../utils/searchFilter";

const Filter = ({
  events,
  setEvents,
  searchTerm,
  filterVisible,
  setFilterVisible,
  onClearFilter,
}) => {
  const handleClick = () => {
    const newEvents = clearSearch(events);
    setEvents(newEvents);

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
  };

  return (
    <>
      {filterVisible && (
        <div onClick={handleClick} className="search-all">
          <div id="clearSearch">
            <span>&times;</span>
          </div>
          <section id="searchresults">
            <p>
              {events.filter((event) => event.isVisible !== false).length}{" "}
              results for <strong>{searchTerm}</strong>
            </p>
          </section>
        </div>
      )}
    </>
  );
};

export default Filter;
