import { cleanString } from "./utilities";

const searchFilter = (query, events) => {
  if (query && events) {
    const reg = new RegExp(cleanString(query), "i"); // used to be 'gi' but was not searching date correctly
    const priority1 = []; // dates
    const priority2 = []; // artist names
    const priority3 = []; // venue names

    // Search the content
    events.forEach(function (article) {
      // Dates
      if (reg.test(cleanString(article.formattedDate))) {
        return priority1.push(article);
      }
      // Artists
      article.artistList.forEach(function (artist) {
        if (reg.test(cleanString(artist.name))) {
          priority2.push(article);
        }
      });
      // Venues
      if (reg.test(cleanString(article.venue.name))) {
        priority3.push(article);
      }
    });

    // Combine the results into a single array
    const results = [].concat(priority1, priority2, priority3);

    // if no results
    if (results.length < 1) {
      // resultMessage.innerHTML = createNoResultsHTML();
    }
    // if have results, match with events and set them to visible
    else {
      events.forEach((event) => {
        event.isVisible = false;
        results.forEach((result) => {
          if (result.id === event.id) {
            event.isVisible = true;
          }
        });
      });
      return events;
    }
  }
};

export default searchFilter;
