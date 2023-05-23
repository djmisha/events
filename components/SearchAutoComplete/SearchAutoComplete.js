import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { formatDataforSearch } from "./SearchAutoComplete.helpers";
import { clearSearch } from "../../utils/searchFilter";

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
          className="search-result"
        >
          <b>{item.type}:</b> {item.name}
        </span>
      </>
    );
  };

  return (
    <div className="SearchAutoComplete">
      <header className="SearchAutoComplete-header">
        <div>
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            onClear={handleOnClear}
            formatResult={formatResult}
            placeholder="Search Artist, Venue, Event"
          />
        </div>
      </header>
    </div>
  );
}

export default SearchAutoComplete;
