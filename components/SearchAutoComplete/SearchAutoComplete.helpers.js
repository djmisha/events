export const formatDataforSearch = (data) => {
  const cleanData = [];
  const venues = [];
  const artists = [];

  mutateData(data, cleanData, venues, artists);

  return cleanData;
};

const mutateData = (data, cleanData, venues, artists) => {
  data &&
    data.map((item) => {
      const { artistList, venue } = item;

      cleanData.push(createObject(item, "Event"));

      artistList.map((artist) => {
        artists.push(createObject(artist, "Artist"));
      });

      venues.push(createObject(venue, "Venue"));
    });

  const cleanVenues = dedupeObjArray(venues);
  cleanVenues.map((item) => cleanData.push(item));

  const cleanArtists = dedupeObjArray(artists);
  cleanArtists.map((item) => cleanData.push(item));
};

const createObject = (item, type) => {
  const { id, name } = item;
  return {
    id,
    name,
    type,
  };
};

const dedupeObjArray = (array) => {
  const unique = array.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.id === current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return unique;
};
