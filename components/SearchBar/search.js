import {
  removeVisible,
  addVisible,
  removeHidden,
  addHidden,
  cleanString,
} from "../../utils/utilities";

function search(eventData) {
  ("use strict");
  const form = document.querySelector("#form-search");
  const input = document.querySelector("#input-search");
  const resultMessage = document.querySelector("#searchresults");
  const clearSearch = document.querySelector("#searchresults");
  const searchCloseBtn = document.querySelector("#clearSearch");
  const allSingleEvents = document.querySelectorAll(".single-event");

  /* Clear Search */

  clearSearch.addEventListener("click", function () {
    showAllEvents(allSingleEvents);
    removeVisible(searchCloseBtn);
    resultMessage.innerHTML = "";
    removeVisible(clearSearch);
  });

  /* Hide all Events on Search input click */
  function hideAllEvents(onPageEvents) {
    onPageEvents.forEach(function (singleEvent) {
      addHidden(singleEvent);
    });
  }

  /* Show all Events on clear search */
  function showAllEvents(onPageEvents) {
    onPageEvents.forEach(function (singleEvent) {
      removeHidden(singleEvent);
    });
  }

  /* Show Matched Events */
  function showMatchedEvents(events, onPageEvents) {
    onPageEvents.forEach(function (singleEvent) {
      const matchedID = singleEvent.getAttribute("data-id");
      if (events.id.toString() === matchedID) {
        removeHidden(singleEvent);
      }
    });
  }

  /**
   * Create the markup when no results are found
   * @return {String} The markup
   */
  const createNoResultsHTML = function () {
    return "<p>No events were found. Search again! </p>";
  };

  /**
   * Create the markup for results
   * @param  {Array} results The results to display
   * @return {String}        The results HTML
   */
  const createResultsHTML = function (results) {
    hideAllEvents(allSingleEvents);
    results.map(function (event) {
      showMatchedEvents(event, allSingleEvents);
    });
    const html = `<p>Found ${results.length} matching events for "${input.value}"</p>`;
    resultMessage.innerHTML = html;
    addVisible(searchCloseBtn);
  };

  /**
   * Search for matches
   * @param  {String} query The term to search for
   */
  const search = function (query) {
    // Variables
    const reg = new RegExp(cleanString(query), "i"); // used to be 'gi' but was not searching date correctly
    const priority1 = []; // dates
    const priority2 = []; // artist names
    const priority3 = []; // venue names

    // Search the content
    eventData.forEach(function (article) {
      if (reg.test(article.formattedDate)) return priority1.push(article);
      article.artist.forEach(function (artlistList) {
        artlistList.forEach(function (artist) {
          if (reg.test(cleanString(artist.name))) priority2.push(article);
        });
      });
      if (reg.test(cleanString(article.venuename))) priority3.push(article);
    });

    // Combine the results into a single array
    const results = [].concat(priority1, priority2, priority3);

    // Display the results
    // if no results
    if (results.length < 1) {
      resultMessage.innerHTML = createNoResultsHTML();
    }
    // if have results
    else {
      createResultsHTML(results);
    }
  };

  /**
   * Handle submit events
   */
  const submitHandler = function (event) {
    event.preventDefault();
    search(input.value);
  };

  /**
   * Remove site: from the input
   */
  // const clearInput = function () {
  // 	input.value = input.value.replace('Search Artist, Venue, Event', '');
  // };

  input.addEventListener("focusin", function (event) {
    input.value = "";
  });

  //
  // Inits & Event Listeners
  //

  // Make sure required content exists
  if (!form || !input || !resultMessage || !eventData) return;

  // Clear the input field
  // clearInput();

  // Create a submit handler
  form.addEventListener("submit", submitHandler, false);
}

export default search;
