import events from "./events.sample.json";
import setDates from "./setDates";

/**
 * Retreives data from EDMtrain API
 * @param {number} id - City or State
 * @param {funciton} setEvents
 * @param {funciton} setLoading
 */

const getEvents = async (id, setEvents, setLoading) => {
  // TEMPORARY FOR DEVELOPMENT ON
  await events;

  parseData(events);
  setEvents(events);
  setLoading(false);

  // TEMPORARY FOR DEVELOPMENT END

  // const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  // const URL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
  // const PATH = URL + id + "&client=" + KEY;
  // await fetch(PATH)
  //   .then(function (response) {
  //     response.json().then((res) => {
  //       // fix this later
  //       res.data.map((event) => {
  //         event.isVisible = true;
  //       });
  //       parseData(res.data)
  //       setEvents(res.data);
  //       setLoading(false);
  //     });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
};

const parseData = (data) => {
  return data.map((item) => {
    // sets all to be visible
    item.isVisible = true;
    // add a formatted date for Search
    item.formattedDate = setDates(item.date).dayMonthYear;
    // add EDM Train as source
    item.eventsource = "edmtrain.com";
  });
};

export default getEvents;
