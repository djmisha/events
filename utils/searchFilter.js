import { cleanString } from "./utilities";

export const searchFilter = (query, events) => {
  let results = [];
  const regexString = new RegExp(cleanString(query), "i"); // used to be 'gi' but was not searching date correctly

  events.forEach(function (article) {
    const { id } = article;
    if (regexString.test(cleanString(article.formattedDate))) {
      results.push(id);
    }
    if (regexString.test(cleanString(article.venue.name))) {
      results.push(id);
    }
    article.artistList.forEach(function (artist) {
      if (regexString.test(cleanString(artist.name))) {
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
    console.log(event.isVisible);
  });

  return events;
};
