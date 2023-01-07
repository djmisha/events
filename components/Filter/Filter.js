import { clearSearch } from "../../utils/searchFilter";

const Filter = ({
  events,
  setEvents,
  searchTerm,
  filterVisible,
  setFilterVisible,
}) => {
  const handleClick = () => {
    const newEvents = clearSearch(events);
    setEvents(newEvents);
    setFilterVisible(false);
  };

  return (
    <>
      {filterVisible && (
        <div onClick={handleClick} className="search-all">
          <div id="clearSearch">
            <span>&times;</span>
          </div>
          <section id="searchresults">
            <p>{searchTerm}</p>
          </section>
        </div>
      )}
    </>
  );
};

export default Filter;
