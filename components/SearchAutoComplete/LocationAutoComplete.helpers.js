export const formatLocationsforSearch = (data) => {
  const cleanData = [];

  mutateData(data, cleanData);

  return cleanData;
};

const mutateData = (data, cleanData) => {
  data &&
    data.map((item) => {
      const { id, city, state } = item;
      if (city) cleanData.push(createObject(id, city, "City"));
      else cleanData.push(createObject(id, state, "State"));
    });
};

const createObject = (id, location, type) => {
  const name = location;
  return {
    id,
    name,
    type,
  };
};
