import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { formatDataforSearch } from "./SearchAutoComplete.helpers";
import { clearSearch } from "../../utils/searchFilter";
import styles from "./SearchAutoComplete.module.scss";

function SearchAutoComplete({
  setSearchTerm,
  events,
  setEvents,
  setFilterVisible,
}) {
  const items = formatDataforSearch(events);

  const handleOnSelect = (item) => {
    setSearchTerm(item.name);
  };

  const handleOnClear = () => {
    const newEvents = clearSearch(events);
    setEvents(newEvents);
    setSearchTerm("");
    setFilterVisible(false);
  };

  const formatResult = (item) => {
    return (
      <>
        <span
          style={{ display: "block", textAlign: "left" }}
          className={styles.searchResult}
        >
          <b>{item.type}:</b> {item.name}
        </span>
      </>
    );
  };

  return (
    <div className={styles.searchAutoComplete}>
      <header className="SearchAutoComplete-header">
        <div>
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            onClear={handleOnClear}
            formatResult={formatResult}
            placeholder="Filter by Artist, Venue, Event"
          />
        </div>
      </header>
    </div>
  );
}

export default SearchAutoComplete;
