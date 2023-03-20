import { cleanString } from "./utilities";

export const searchFilter = (searchTerm, events) => {
  let results = [];
  const regexString = new RegExp(cleanString(searchTerm), "i"); // used to be 'gi' but was not searching date correctly

  events.forEach((article) => {
    const { id, formattedDate, venue, artistList, name } = article;
    const { name: venueName } = venue;

    if (regexString.test(cleanString(formattedDate))) {
      results.push(id);
    }

    if (regexString.test(cleanString(venueName))) {
      results.push(id);
    }

    if (name && regexString.test(cleanString(name))) {
      results.push(id);
    }

    artistList.forEach((artist) => {
      const { name } = artist;

      if (regexString.test(cleanString(name))) {
        results.push(id);
      }
    });
  });

  if (results.length) return showMatchedEvents(results, events);
};

const showMatchedEvents = (results, events) => {
  events.forEach((event) => {
    event.isVisible = false;
    results.forEach((result) => {
      if (result === event.id) {
        event.isVisible = true;
      }
    });
  });

  return events;
};

export const clearSearch = (events) => {
  events.forEach((event) => {
    if (!event.isVisible) event.isVisible = true;
  });

  return events;
};
