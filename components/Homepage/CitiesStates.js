import { useContext } from "react";
import { AppContext } from "../../features/AppContext";
import Link from "next/link";

const CitiesStates = ({
  locations,
  showCitiesOnly = false,
  showStatesOnly = false,
}) => {
  const cities = locations.filter((location) => location.city);
  const states = locations.filter(
    (location) => location.state && !location.city
  );
  const { addLocation } = useContext(AppContext);

  const handleClick = (location) => addLocation(location);

  const renderList = (locations, property) => {
    return locations.map((location) => (
      <li key={location.id}>
        <Link
          href={`/events/${location.slug}`}
          onClick={() => handleClick(location)}
        >
          {location[property]}
        </Link>
      </li>
    ));
  };

  return (
    <div className="[&_ul]:list-none [&_ul]:m-0 [&_ul]:p-0 [&_ul]:pl-3 [&_ul]:flex [&_ul]:flex-wrap [&_li]:w-1/2 [&_li]:py-3 md:[&_li]:w-1/4 [&_a]:no-underline [&_a]:text-black">
      {!showStatesOnly && (
        <>
          <h2 className="text-lg mb-4 px-2">
            Popular Dance Music Cities in North America
          </h2>
          <p className="mb-4 px-2">
            Explore electronic dance music events in major North American
            cities. From nightclub shows to festivals and DJ performances, find
            upcoming events in your city or plan your next music destination.
          </p>
          <ul>{renderList(cities, "city")}</ul>
        </>
      )}
      {!showCitiesOnly && (
        <>
          <h2 className="text-lg mb-4 px-2">Browse EDM Events by State</h2>

          <ul>{renderList(states, "state")}</ul>
        </>
      )}
    </div>
  );
};

export default CitiesStates;
