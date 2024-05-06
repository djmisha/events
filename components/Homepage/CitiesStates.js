import { useContext } from "react";
import { AppContext } from "../../features/AppContext";
import Link from "next/link";

const CitiesStates = ({ locations }) => {
  const cities = locations.slice(0, 50);
  const states = locations.slice(50);
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
    <>
      <h2>Cities</h2>
      <ul>{renderList(cities, "city")}</ul>
      <h2>States</h2>
      <ul>{renderList(states, "state")}</ul>
    </>
  );
};

export default CitiesStates;
