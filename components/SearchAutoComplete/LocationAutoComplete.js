import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { formatLocationsforSearch } from "./LocationAutoComplete.helpers";
import locations from "../../utils/locations.json";
import { toSlug } from "../../utils/getLocations";

function LocationAutoComplete() {
  const items = formatLocationsforSearch(locations);

  const handleOnSelect = (item) => {
    const url = `events/${toSlug(item.name)}`;
    window.location.assign(url);
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
    <div className="LocationAutoComplete">
      <header className="LocationAutoComplete-header">
        <div>
          <ReactSearchAutocomplete
            items={items}
            onSelect={handleOnSelect}
            formatResult={formatResult}
            placeholder="Search for City or State"
          />
        </div>
      </header>
    </div>
  );
}

export default LocationAutoComplete;
