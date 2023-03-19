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
        <span style={{ display: "block", textAlign: "left" }}>
          {item.type}: {item.name}
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
            // onSearch={handleOnSearch}
            // onHover={handleOnHover}
            onSelect={handleOnSelect}
            // onFocus={handleOnFocus}
            onClear={handleOnClear}
            autoFocus
            formatResult={formatResult}
            placeholder="Search for Artist, Venue, Event"
          />
        </div>
      </header>
    </div>
  );
}

export default SearchAutoComplete;
