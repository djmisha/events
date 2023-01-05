import { getLocations } from "./getLocations";

/* Remove Duplicates Helper */

export const removeDuplicates = (array) => {
  return array.filter((a, b) => array.indexOf(a) === b);
};

/**
 * Removes &amp; from string and
 * special characters except letters and numbers
 * @param {*} string
 * @returns clean string
 */
export const cleanString = (string) => {
  const cleanString = string
    .replace(/&amp;/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "");
  return cleanString;
};

/**
 * Functions to create event arrays of strings
 */

export const makePageTitle = (city, state) => {
  return `Music Events in ${city ? `${city}, ${state}` : state}`;
};

export const makeVenues = (data) => {
  return removeDuplicates(data.map((item) => item.venue.name));
};

export const makeDates = (data) => {
  return removeDuplicates(data.map((item) => item.formattedDate));
};

export const makeArtists = (data) => {
  let allArtists = [];
  data.map((item) => {
    return item.artistList.map((artist) => {
      allArtists.push(artist.name);
    });
  });
  allArtists = removeDuplicates(allArtists);

  return allArtists;
};

export const makeLocations = () => {
  let locations = getLocations();
  locations = locations.map((loc) => {
    return loc.city || loc.state;
  });

  return locations;
};

{
  /* <title>House Music Events, Festivals, EDM Shows, Techno, Raves, Dance Clubs</title> */
  // <meta name="description"
  // content="Find house music events festivals dance clubs techno raves edm shows in a city near you. " />
}
