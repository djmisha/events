import React, { useState } from "react";
import LocationManager from "../LocationManager/LocationManager";
import Modal from "../Modal/Modal";
import MenuTrigger from "../ui/MenuTrigger";
import { useLocation } from "../../hooks/useLocation";
import styles from "./LocationSelectModal.module.scss";

const LocationSelectModal = ({ image, text = "Location" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentLocation, hasLocation } = useLocation();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLocationChanged = (location) => {
    // Location is automatically handled by LocationManager and useLocation hook
    console.log("Location changed in navigation:", location);
  };

  // Create LocationManager component for the modal
  const LocationManagerComponent = () => (
    <LocationManager
      onLocationChanged={handleLocationChanged}
      title="Choose Location"
      showCurrentLocation={true}
      showShareButton={true}
      showLocationSwitch={true}
      className={styles.modalLocationManager}
    />
  );

  // Display current location or default text
  const displayText =
    hasLocation && currentLocation
      ? currentLocation.city
        ? `${currentLocation.city}, ${
            currentLocation.stateCode || currentLocation.state
          }`
        : currentLocation.state || text
      : text;

  return (
    <div className={styles.navItem}>
      <MenuTrigger
        icon={image}
        text={displayText}
        onClick={handleOpenModal}
        iconAlt={text}
        className={hasLocation ? styles.hasLocationTrigger : undefined}
      />

      {isModalOpen && (
        <Modal
          component={LocationManagerComponent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LocationSelectModal;
