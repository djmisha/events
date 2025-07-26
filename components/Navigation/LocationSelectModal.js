import React, { useState } from "react";
import LocationManager from "../LocationManager/LocationManager";
import Modal from "../Modal/Modal";
import MenuTrigger from "../ui/MenuTrigger";
import { useLocation } from "../../hooks/useLocation";

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
      className="max-w-lg w-full p-0"
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
    <div className="relative">
      <MenuTrigger
        icon={image}
        text={displayText}
        onClick={handleOpenModal}
        iconAlt={text}
        iconWidth={18}
        iconHeight={18}
        className={`mt-2 ${hasLocation ? "hasLocationTrigger" : ""}`}
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
