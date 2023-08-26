import { allArtists } from "../../utils/getArtists";
import locations from "../../utils/locations.json";

export const formatDataforSearch = () => {
  const cleanData = [];

  mutateData(locations, allArtists, cleanData);

  return cleanData;
};

const mutateData = (locations, allArtists, cleanData) => {
  locations &&
    locations.map((item) => {
      const { id, city, state } = item;
      if (city) cleanData.push(createObject(id, city, "City"));
      else cleanData.push(createObject(id, state, "State"));
    });

  allArtists &&
    allArtists.map((item) => {
      const { id, name } = item;
      cleanData.push(createObject(id, name, "Artist"));
    });
};

const createObject = (id, name, type) => {
  return {
    id,
    name,
    type,
  };
};
