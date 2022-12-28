var dayjs = require("dayjs");

export const createClickableElement = (array, targetElement, funcAction) => {
  array.forEach(function (item) {
    var element = document.createElement("div");
    element.innerHTML = item;
    targetElement.appendChild(element);
    element.addEventListener("click", funcAction);
  });
};

export const attachNavTitle = (menu, navtitle) => {
  const navEl = menu.previousElementSibling.nextElementSibling;
  const title = document.createElement("h2");
  title.innerHTML = navtitle;
  navEl.prepend(title);
};

export const readableDate = (date) => {
  return dayjs(date).format("dddd, MMMM D");
};

export function parseData(response, dataArray) {
  const { data } = response;
  for (var g = 0; g < data.length; g++) {
    /*Convert date to ISO for Schema */
    var eventDateISO = new Date(data[g].date);

    /*Create Event Object*/
    var singleEventListing = {
      id: data[g].id,
      name: data[g].name,
      date: data[g].date,
      formattedDate: readableDate(data[g].date),
      link: data[g].link,
      venuename: data[g].venue.name,
      venueaddress: data[g].venue.address,
      venuecity: data[g].venue.location,
      venuestate: data[g].venue.state,
      artist: [data[g].artistList],
      image: "",
      schemadate: eventDateISO,
      starttime: data[g].startTime,
      eventsource: "edmtrain.com",
    };
    dataArray.push(singleEventListing);
  }
}

/*  Show and Hide Elements on Page  */

export const removeVisible = (element) => {
  element.classList.remove("visible");
};

export const addVisible = (element) => {
  element.classList.add("visible");
};

export const removeHidden = (element) => {
  element.classList.remove("hidden");
};

export const addHidden = (element) => {
  element.classList.add("hidden");
};

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
