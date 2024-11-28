import sampleEvents from "./allevents.sample.json";
import artistDB from "./../localArtistsDB.json";
import { removeDuplicates, ToSlugArtist } from "./utilities";
import { parseData } from "./getEvents";

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
 * Returns all unique artists in all events array
 *
 * This can be used for SearchAutocomple Component
 * @returns Array
 */

export const getUniqueArtists = (array) => {
  const allArtists = [];

  array.map((artist) => {
    const { id, name } = artist;
    const slug = ToSlugArtist(name);

    allArtists.push({
      id,
      name,
      slug,
    });
  });

  // TODO:  probably dont need this anymore, array is already unique but double check
  const cleanArtists = dedupeObjArray(allArtists);

  return cleanArtists;
};

// all the unique artists from static data
export const allArtists = getUniqueArtists(artistDB);

/**
 * This algo counts the number of times an artists appears in the data
 * and returns a sorted array with the artist name, id, counts
 *
 * Todo:
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

  return finalArtists;
};

/**
 *
 * functions to create unique artists pages
 */
const uniqueArtists = getUniqueArtists(sampleEvents);

// gets slug for each artists
export const getAritstIds = async () => {
  return artistDB.map((artist) => {
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
export const getArtistData = async (slug) => {
  let data;
  artistDB.map((artist) => {
    const { name } = artist;
    if (slug === ToSlugArtist(name)) data = artist;
  });

  return {
    slug,
    ...data,
  };
};

// Determine URL to use based on env
const setURL = (id) => {
  let url;

  if (process.env.NODE_ENV === "development") {
    url = `http://localhost:3000/api/artists/${id}`;
  } else {
    url = `https://www.sandiegohousemusic.com/api/artists/${id}`;
  }

  return url;
};

// get events for each artist
export const getArtistEvents = async (id, setEvents) => {
  const url = setURL(id);

  const response = await fetch(url, { mode: "no-cors" });
  if (response.ok) {
    const json = await response.json();
    parseData(json.data);
    setEvents(json.data);
  } else {
    throw new Error(response.statusText);
  }
};
