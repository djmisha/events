import { useContext } from "react";
import { AppContext } from "../../features/AppContext";
import Link from "next/link";
import styles from "./CitiesStates.module.scss";

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
    <div className={styles.citiesStates}>
      {!showStatesOnly && (
        <>
          <h2>Popular Dance Music Cities in North America</h2>
          <p>
            Explore electronic dance music events in major North American
            cities. From nightclub shows to festivals and DJ performances, find
            upcoming events in your city or plan your next music destination.
          </p>
          <ul>{renderList(cities, "city")}</ul>
        </>
      )}
      {!showCitiesOnly && (
        <>
          <h2>Browse EDM Events by State</h2>
          <ul>{renderList(states, "state")}</ul>
        </>
      )}
    </div>
  );
};

export default CitiesStates;
