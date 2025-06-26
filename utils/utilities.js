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
  return removeDuplicates(data.map((item) => item.venue.name)).sort();
};

export const makeDates = (data) => {
  const dateMapping = {}; // Map original date to formatted date

  data.forEach((item) => {
    if (item.formattedDate && item.date) {
      dateMapping[item.date] = item.formattedDate;
    }
  });

  // Sort by original date (chronological order) but return formatted dates
  return Object.keys(dateMapping)
    .sort()
    .map((originalDate) => dateMapping[originalDate]);
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
  const imageURL = `${url}${cleanString}.jpg`;

  return imageURL;
};

export const ToSlugArtist = (string) => {
  if (!string) return "undefined";

  const cleanString = string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks but keep base letters
    .replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "-") // Keep letters including accented ones
    .replace(/ /g, "-")
    .split("&")
    .join("&amp;")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleanString;
};

/**
 * Removes artists with the name "Surprise Guest", "TBD", or "Special Guest" from an array.
 * @param {Array} artists
 * @returns {Array}
 */
export function filterSurpriseGuest(artists) {
  return artists.filter((artist) => {
    const name = artist.name?.toLowerCase();
    return (
      name !== "tbd" &&
      name !== "tba" &&
      name !== "surprise guest" &&
      name !== "special guest"
    );
  });
}

export const formatDateToHuman = (dateString) => {
  if (!dateString) return dateString;

  try {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    return dateString; // Return original if formatting fails
  }
};

export const makePromoters = (data) => {
  // Count occurrences of each event name
  const eventNameCounts = {};
  data.forEach((item) => {
    if (item.name) {
      eventNameCounts[item.name] = (eventNameCounts[item.name] || 0) + 1;
    }
  });

  // Filter to only include event names with more than 2 events
  const promoters = Object.keys(eventNameCounts).filter(
    (eventName) => eventNameCounts[eventName] > 1
  );

  // Alphabetize the list and remove duplicates
  return removeDuplicates(promoters).sort();
};

export const makeVenuesWithCounts = (data) => {
  const venueCounts = {};
  data.forEach((item) => {
    if (item.venue && item.venue.name) {
      venueCounts[item.venue.name] = (venueCounts[item.venue.name] || 0) + 1;
    }
  });

  return Object.keys(venueCounts)
    .sort()
    .map((venue) => ({
      name: venue,
      count: venueCounts[venue],
    }));
};

export const makeDatesWithCounts = (data) => {
  const dateCounts = {};
  const dateMapping = {}; // Map original date to formatted date

  data.forEach((item) => {
    if (item.formattedDate && item.date) {
      dateCounts[item.formattedDate] =
        (dateCounts[item.formattedDate] || 0) + 1;
      dateMapping[item.date] = item.formattedDate;
    }
  });

  // Sort by original date (chronological order) but display formatted date
  return Object.keys(dateMapping)
    .sort()
    .map((originalDate) => {
      const formattedDate = dateMapping[originalDate];
      return {
        name: formattedDate, // Display the formatted date
        originalDate: formattedDate, // Use formatted date for filtering
        count: dateCounts[formattedDate],
      };
    });
};

export const makePromotersWithCounts = (data) => {
  const eventNameCounts = {};
  data.forEach((item) => {
    if (item.name) {
      eventNameCounts[item.name] = (eventNameCounts[item.name] || 0) + 1;
    }
  });

  // Filter to only include event names with more than 1 event
  return Object.keys(eventNameCounts)
    .filter((eventName) => eventNameCounts[eventName] > 1)
    .sort()
    .map((promoter) => ({
      name: promoter,
      count: eventNameCounts[promoter],
    }));
};
