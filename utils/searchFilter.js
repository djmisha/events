import { cleanString } from "./utilities";

const SearchFilter = (query, eventData, SetEvents) => {
  if (query && eventData) {
    // console.log(query, eventData);
    /**
     * Search for matches
     * @param  {String} query The term to search for
     */
    // const search = function (query) {
    // Variables
    const reg = new RegExp(cleanString(query), "i"); // used to be 'gi' but was not searching date correctly
    const priority1 = []; // dates
    const priority2 = []; // artist names
    const priority3 = []; // venue names

    // Search the content
    eventData.forEach(function (article) {
      if (reg.test(article.date)) return priority1.push(article);
      article.artistList.forEach(function (artist) {
        if (reg.test(cleanString(artist.name))) priority2.push(article);
      });
      if (reg.test(cleanString(article.venue.name))) priority3.push(article);
    });

    // Combine the results into a single array
    const results = [].concat(priority1, priority2, priority3);

    // Display the results
    // if no results
    if (results.length < 1) {
      // resultMessage.innerHTML = createNoResultsHTML();
    }
    // if have results
    else {
      console.log("query", query);
      console.log("results", results);
      return results;
      // eventData.forEach((event) => {
      //   event.isVisible = false;
      //   results.forEach((result) => {
      //     if (result.id === event.id) {
      //       event.isVisible = true;
      //       console.log(event.isVisible);
      //     } else {
      //     }
      //   });
      // });
      // eventData.forEach((event) => {
      //   if (event) {
      //     console.log(event.isVisible);
      //   }
      // });
      // maybe don't do this here, insated just return matching ID's
      // SetEvents(eventData);
      // createResultsHTML(results);
    }
    // };
  }
};

export default SearchFilter;
