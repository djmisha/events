import events from "./events.sample.json";
import setDates from "./setDates";

/**
 * Retreives data from EDMtrain API
 * @param {number} id - City or State
 * @returns {Promise<Array>} - Events data
 */
const getEvents = (id, setEvents, setLoading) => {
  if (process.env.NODE_ENV === "development") {
    return getSampleEvents();
  } else {
    return getEventsProd(id);
  }
};

const getEventsProd = async (id) => {
  console.log(id);
  const PATH = `https://www.sandiegohousemusic.com/api/events/${id}`;

  try {
    const response = await fetch(PATH, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    return parseData(res.data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

// does not make API Call
const getSampleEvents = async () => {
  parseData(events);
  console.log(events);
  return events;
};

export const parseData = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => {
    // sets all to be visible
    item.isVisible = true;
    // add a formatted date for Search
    item.formattedDate = setDates(item.date).dayMonthYear;
    // add EDM Train as source
    item.eventSource = "edmtrain.com";
    return item;
  });
};

export default getEvents;

export const getEventsHome = async (id, setEvents, setLoading) => {
  if (process.env.NODE_ENV === "development") {
    console.log("getEventsHome");
    const sample = await getSampleEvents();
    parseData(sample);
    setEvents(sample);
    setLoading(false);
  } else {
    const PATH = `https://www.sandiegohousemusic.com/api/events/${id}`;

    await fetch(PATH, { mode: "cors" })
      .then(function (response) {
        response.json().then((res) => {
          parseData(res.data);
          setEvents(res.data);
          setLoading(false);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }
};
