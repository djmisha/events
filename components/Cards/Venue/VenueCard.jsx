import styles from "./VenueCard.module.scss";

const VenueCard = ({ venue }) => {
  if (!venue) return null;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{venue.name}</h3>
        <div className={styles.details}>
          <p className={styles.location}>{venue.location}</p>
          <p className={styles.address}>{venue.address}</p>
        </div>
        <div className={styles.coordinates}>
          {/* <p>Lat: {venue.latitude.toFixed(3)}</p>
          <p>Long: {venue.longitude.toFixed(3)}</p> */}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
