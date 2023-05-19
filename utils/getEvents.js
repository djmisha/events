import events from "./events.sample.json";
import setDates from "./setDates";

/**
 * Retreives data from EDMtrain API
 * @param {number} id - City or State
 * @param {funciton} setEvents
 * @param {funciton} setLoading
 */

const getEvents = (id, setEvents, setLoading) => {
  if (process.env.NODE_ENV === "development") {
    return getSampleEvents(id, setEvents, setLoading);
  } else {
    return getEventsProd(id, setEvents, setLoading);
  }
};

const getEventsProd = async (id, setEvents, setLoading) => {
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const URL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
  const PATH = URL + id + "&client=" + KEY;

  await fetch(PATH)
    .then(function (response) {
      response.json().then((res) => {
        parseData(res.data);
        // setEvents(res.data);
        // setLoading(false);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
};

// does not make API Call
const getSampleEvents = async (id, setEvents, setLoading) => {
  await events;
  parseData(events);
  setEvents(events);
  setLoading(false);
};

export const parseData = (data) => {
  return data.map((item) => {
    // sets all to be visible
    item.isVisible = true;
    // add a formatted date for Search
    item.formattedDate = setDates(item.date).dayMonthYear;
    // add EDM Train as source
    item.eventSource = "edmtrain.com";
  });
};

export default getEvents;
