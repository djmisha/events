import events from "./events.sample.json";

/**
 * Retreives data from EDMtrain API
 * @param {number} id
 * @param {funciton} setEvents
 * @param {funciton} setLoading
 */

const getEvents = async (id, setEvents, setLoading) => {
  // TEMPORARY FOR DEVELOPMENT
  await events;
  // THIS IS BAD HERE, need to fix
  events.map((event) => {
    event.isVisible = true;
  });
  setEvents(events);
  setLoading(false);

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
  //       setEvents(res.data);
  //       setLoading(false);
  //     });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
};

export default getEvents;
