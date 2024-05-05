import React, { createContext, useState, useMemo } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [locationCtx, setLocationCtx] = useState([]);
  const [eventsCtx, setEventsCtx] = useState([]);

  const addLocation = (location) => {
    setLocationCtx((prevLocations) => {
      // Check if a location with the same id already exists in the array
      const locationExists = prevLocations.some(
        (prevLocation) => prevLocation.id === location.id
      );

      // If a location with the same id doesn't exist, add it to the array
      if (!locationExists) return [...prevLocations, location];

      // If a location with the same id already exists, return the previous array
      return prevLocations;
    });
  };

  const value = useMemo(
    () => ({ locationCtx, addLocation, eventsCtx, setEventsCtx }),
    [locationCtx, eventsCtx]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default <></>;
