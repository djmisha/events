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

export const cityOrState = (city, state) => {
  const string = city ? `${city}, ${state}` : `${state}`;
  return string;
};

export const makePageTitle = (city, state) => {
  return `Dance Music Events in ${cityOrState(
    city,
    state
  )} - Nightclub DJ & Concerts`;
};

export const makePageHeadline = (city, state) => {
  return `Music Events in ${cityOrState(city, state)}`;
};

export const makePageDescription = (city, state) => {
  let title = `Find electronic dance music events in  ${cityOrState(
    city,
    state
  )}! From nightclub DJ's to EDM concerts - experience live music at raves, parties and clubs near you.`;
  return title;
};

export const urlBigData = (lat, long) => {
  return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
};

/**
 * Randomize Array Utility
 */
export const shuffleArray = (array) => {
  if (!array) return;
  const newArray = array;
  let currentIndex = array?.length;
  let temporaryValue;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return newArray;
};

/**
 * Creates string for image file
 */

export const makeImageUrl = (string) => {
  const url = "/images/artists/";
  const cleanString = string.split("'").join("&#39").split("/").join("&#47");
  // when these are on it does not work.
  // todo: image scrape - file names should not have special characters
  // .split("(")
  // .join("%28")
  // .split(")")
  // .join("%29")
  // .split(" ")
  // .join("%20");

  const imageURL = `${url}${cleanString}.jpg`;

  return imageURL;
};

export const ToSlugArtist = (string) => {
  if (!string) return "undefined";
  const cleanString = string
    .replace(/[^a-zA-Z0-9 ]/g, "-") // Replace non-alphanumeric characters except spaces
    .replace(/ /g, "-") // Replace spaces with dashes
    .split("&")
    .join("&amp;")
    .toLowerCase()
    .replace(/-+/g, "-") // Replace multiple dashes with a single dash
    .replace(/^-+|-+$/g, ""); // Trim dashes from the start and end of the string

  return cleanString;
};
