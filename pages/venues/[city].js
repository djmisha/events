import Head from "next/head";
import locations from "../../utils/locations.json";
import VenueCard from "../../components/Cards/Venue/VenueCard";
import styles from "../../styles/VenuesPage.module.css";

export default function VenuesPage({ venues, cityData }) {
  const pageTitle = `Venues in ${cityData.city || cityData.state}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{cityData.city || cityData.state}</h1>
          <p className={styles.subtitle}>
            {cityData.city ? `${cityData.state}, ${cityData.stateCode}` : ""}
          </p>
          <p className={styles.venueCount}>
            {venues.length} venue{venues.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className={styles.grid}>
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const urlCity = params.city.replace(/-/g, " ");

    const cityData = locations.find((loc) => {
      const locationName = loc.city || loc.state;
      return locationName.toLowerCase() === urlCity.toLowerCase();
    });

    if (!cityData) {
      return { notFound: true };
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/venues/${cityData.id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.data) {
      return {
        props: {
          venues: [],
          cityData,
        },
      };
    }

    return {
      props: {
        venues: data.data,
        cityData,
      },
    };
  } catch (error) {
    return {
      props: {
        venues: [],
        cityData: { state: params.city, city: null },
      },
    };
  }
}
