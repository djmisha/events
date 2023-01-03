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
  const clean = string.replace(/&amp;/g, "").replace(/[^a-zA-Z0-9 ]/g, "");
  return clean;
};

export const makePageTitle = (city, state) => {
  return `Music Events in ${city ? `${city}, ${state}` : state}`;
};
