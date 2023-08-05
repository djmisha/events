/**
 * todo:
 - remove musics css, delete file
 - update main navigation: remove music + submit mix
 */

import sampleEvents from "./allevents.sample.json";
import { removeDuplicates, ToSlugArtist } from "./utilities";

/**
 * on Dev we return a sample array vs Prod we make a fetch call
 * @returns function based on env
 */
export const getArtists = () => {
  if (process.env.NODE_ENV === "development") {
    return getArtistsSample(sampleEvents);
  } else {
    // return getArtistsProd();
  }
};

const getArtistsSample = (sampleEvents) => {
  return getArtistsCounts(sampleEvents);
};

const getArtistsProd = async () => {
  const PATH = "https://www.sandiegohousemusic.com/api/allevents/";
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
 * This can be used for SearchAutocomple Component
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
  const allArtists = []; // with duplicates
  const finalArtists = []; // duplicates removed
  const artistCount = {}; // keeps count for each artists show
  const locationCount = {}; // keeps count for each city of artists

  // loop through array
  for (const event of array) {
    const { artistList, venue } = event;
    const { location } = venue;
    // loop through artists
    for (const artist of artistList) {
      const { id, name } = artist;
      // add artist to array
      allArtists.push({ id, name });

      // add counts to artistCount
      if (!artistCount[id]) {
        // if don't have in object start the count at 1
        artistCount[id] = 1;
      } else {
        // otherwise increment the counter
        artistCount[id]++;
      }

      // add city counts to locationCount
      if (!locationCount[id]) {
        // if don't have in object, make array and add location
        locationCount[id] = [location];
      } else {
        // otherwise push location to array
        locationCount[id] = [...locationCount[id], location];
      }
    }
  }

  // remove duplicates from AllArtists
  const cleanArtists = dedupeObjArray(allArtists);

  // loop through artistCount object
  for (const artistId in artistCount) {
    if (artistCount.hasOwnProperty(artistId)) {
      const count = artistCount[artistId];
      const locations = removeDuplicates(locationCount[artistId]).length;
      const artist = cleanArtists.find((a) => a.id === parseInt(artistId));

      if (artist) {
        finalArtists.push({
          id: artist.id,
          name: artist.name,
          count: count,
          locations: locations,
        });
      }
    }
  }

  // sort by the nighest number of count
  finalArtists.sort((a, b) => b.count - a.count);

  console.log(finalArtists);
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

/**
 *
 * functions to create unique artists pages
 */
const uniqueArtists = getUniqueArtists(sampleEvents);

// gets slug for each artists
export const getAritstIds = () => {
  return uniqueArtists.map((artist) => {
    const { name } = artist;
    const id = ToSlugArtist(name);

    return {
      params: {
        id,
      },
    };
  });
};

// get data for each artist
export const getArtistData = (slug) => {
  let data;
  uniqueArtists.map((artist) => {
    const { name } = artist;
    if (slug === ToSlugArtist(name)) data = artist;
  });

  return {
    slug,
    ...data,
  };
};

/**
 * Get Event Data for each Artist
 */

export const getArtistEvents = async (id, setEvents, setLoading) => {
  const PATH = `https://www.sandiegohousemusic.com/api/artists/357`;

  await fetch(PATH, { mode: "no-cors" })
    .then(function (response) {
      // failing here
      // failing here
      // failing here
      // debugger;
      if (response.statusCode === 200) {
        response.json().then((res) => {
          console.log(response);
          // parseData(res.data);
          setEvents(res.data);
          setLoading(false);
        });
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

// // Help from Bard
// const url = "https://example.com/api/data.json";

// fetch(url)
//   .then((response) => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error(response.statusText);
//     }
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
