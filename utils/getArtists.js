/**
 * todo:
 - finish layout for top artists
 - remove musics css, delete file
 - update main navigation: remove music + submit mix, add top artists 
 */

import sampleEvents from "./allevents.sample.json";

/**
 * on Dev we return a sample array vs Prod we make a fetch call
 * @returns function based on env
 */
export const getArtists = () => {
  if (process.env.NODE_ENV === "development") {
    // return getArtistsSample(sampleEvents);
    return getArtistsProd();
  } else {
    return getArtistsProd();
  }
};

const getArtistsSample = (sampleEvents) => {
  console.log(sampleEvents);
  return getArtistsCounts(sampleEvents);
};

const getArtistsProd = async () => {
  const PATH = "https://www.sandiegohousemusic.com/api/events/";
  await fetch(PATH, { mode: "cors" })
    .then(function (response) {
      response.json.then((res) => {
        getArtistsCounts(res.data);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
};

/**
 * Returns all unique artists in all events array
 *
 * @returns Array
 */

export const getUniqueArtists = (array) => {
  const allArtists = [];

  array.map((event) => {
    event.artistList &&
      event.artistList.map((artist) => {
        const { id, name } = artist;

        allArtists.push({
          id,
          name,
        });
      });
  });

  const cleanArtists = dedupeObjArray(allArtists);

  return cleanArtists;
};

/**
 * This algo counts the number of times an artists appears
 * and returns a sorted array with the artist name, id, counts
 *
 * todo:
 * - need to loop only cities? because artists appear again on State events? maybe not
 * @returns Array
 */

export const getArtistsCounts = (array) => {
  // const events = array;
  const allArtists = [];
  const finalArtists = [];
  const artistCount = {};

  // loop through array
  for (const event of array) {
    console.log(event);
    const { artistList } = event;
    // loop through artists
    for (const artist of artistList) {
      const { id, name } = artist;
      // add artist to array
      allArtists.push({ id, name });

      // add counts to count object
      if (!artistCount[id]) {
        // if don't have in object start the count at 1
        artistCount[id] = 1;
      } else {
        // otherwise increment the counter
        artistCount[id]++;
      }
    }
  }

  // remove duplicates from AllArtists
  const cleanArtists = dedupeObjArray(allArtists);

  // loop through artistCount object
  for (const artistId in artistCount) {
    if (artistCount.hasOwnProperty(artistId)) {
      const count = artistCount[artistId];
      const artist = cleanArtists.find((a) => a.id === parseInt(artistId));

      if (artist) {
        finalArtists.push({
          id: artist.id,
          name: artist.name,
          count: count,
        });
      }
    }
  }

  // sort by the nighest number of count
  finalArtists.sort((a, b) => b.count - a.count);

  // console.log(finalArtists);
  return finalArtists;
};

// Removes Duplicate items from an array
const dedupeObjArray = (array) => {
  const unique = array.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.id === current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return unique;
};
