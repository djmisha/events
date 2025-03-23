import React from "react";
import Link from "next/link";
import styles from "./OtherLocations.module.scss";

interface OtherLocationsProps {
  currentLocationId?: number;
}

const OtherLocations: React.FC<OtherLocationsProps> = ({
  currentLocationId,
}) => {
  return (
    <div className={styles.otherLocationsContainer}>
      <h3 className={styles.sectionTitle}>Other Locations</h3>

      <div className={styles.locationsList}>
        {/* Placeholder for locations list */}
        <p className={styles.placeholderText}>
          More locations will be displayed here
        </p>
      </div>
    </div>
  );
};

export default OtherLocations;
