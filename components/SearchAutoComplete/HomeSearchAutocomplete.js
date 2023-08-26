import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { formatDataforSearch } from "./HomeSearchAutocomplete.helpers";
import { toSlug } from "../../utils/getLocations";

function HomeSearchAutocomplete() {
  const items = formatDataforSearch();

  const handleOnSelect = (item) => {
    const { name, type } = item;
    if (type === "Artist") {
      const url = `artist/${toSlug(name)}`;
      window.location.assign(url);
    }
    if (type === "City" || type === "State") {
      const url = `events/${toSlug(item.name)}`;
      window.location.assign(url);
    }
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
    <div className="HomeSearchAutocomplete">
      <header className="HomeSearchAutocomplete-header">
        <div>
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            formatResult={formatResult}
            placeholder="Search for Artist, City or State"
          />
        </div>
      </header>
    </div>
  );
}

export default HomeSearchAutocomplete;
