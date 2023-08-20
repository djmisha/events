import Link from "next/link";

const CitiesStates = ({ locations }) => {
  return (
    <>
      <h2>Cities</h2>
      <ul>
        {locations.map((location, index) => {
          if (index > 49) return;
          return (
            <li key={location.id}>
              <Link href={`/events/${location.slug}`}>{location.city}</Link>
            </li>
          );
        })}
      </ul>
      <h2>States</h2>
      <ul>
        {locations.map((location, index) => {
          if (index > 49) {
            return (
              <li key={location.id}>
                <Link href={`/events/${location.slug}`}>{location.state}</Link>
              </li>
            );
          }
        })}
      </ul>
    </>
  );
};

export default CitiesStates;
