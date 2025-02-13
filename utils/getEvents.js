import setDates from "./setDates";

/**
 * Retreives data from EDMtrain API
 * @param {number} id - City or State
 * @returns {Promise<Array>} - Events data
 */

const getEvents = async (id) => {
  const PATH = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`;

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
  const PATH = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`;

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
};
