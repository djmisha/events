import setDates from "./setDates";

/**
 * Retreives data from EDMtrain API
 * @param {number} id - City or State
 * @returns {Promise<Array>} - Events data
 */

const getEvents = async (id) => {
  const PATH = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`;

  try {
    const [EDMTrainApiData, ticketMasterApiData] = await queryEventsData(
      id,
      city
    );
    const combinedEvents = combineEvents(EDMTrainApiData, ticketMasterApiData);
    return parseData(combinedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

const queryEventsData = async (id, city) => {
  const EDMTrainApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`;
  const ticketMasterApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/ticketmaster/events/${city}`;

  const [EDMTrainApiResponse, ticketMasterApiResponse] = await Promise.all([
    fetch(EDMTrainApiUrl),
    fetch(ticketMasterApiUrl),
  ]);

  const EDMTrainApiData = await EDMTrainApiResponse.json();
  const ticketMasterApiData = await ticketMasterApiResponse.json();

  return [EDMTrainApiData, ticketMasterApiData];
};

const combineEvents = (EDMTrainApiData, ticketMasterApiData) => {
  // const currentCity = EDMTrainApiData.data?.[0]?.venue.location.split(",")[0];

  const formattedTicketMasterEvents = ticketMasterApiData._embedded.events
    // .filter(
    //   (event) =>
    //     event._embedded.venues[0].city.name.toLowerCase() ===
    //     currentCity.toLowerCase()
    // )
    .map((event) => {
      const image = event.images.find((img) => img.ratio === "4_3");
      const venue = event._embedded.venues[0];
      return {
        date: event.dates.start.localDate,
        artistList: event._embedded.attractions.map((attraction) => ({
          name: attraction.name,
        })),
        name: event.name,
        venue: {
          name: venue.name,
          address: `${venue.address.line1}, ${venue.city.name}, ${venue.state.stateCode}, ${venue.postalCode}, ${venue.country.countryCode}`,
        },
        link: event.url,
        isVisible: true,
        eventSource: "ticketmaster",
        imageUrl: image ? image.url : null,
      };
    });

  const combinedEvents = [
    ...(EDMTrainApiData.data || []),
    ...formattedTicketMasterEvents,
  ];

  const uniqueEvents = combinedEvents.reduce((acc, event) => {
    const duplicateIndex = acc.findIndex(
      (e) => e.date === event.date && e.venue.name === event.venue.name
    );
    if (duplicateIndex !== -1) {
      acc[duplicateIndex] = event; // Use TicketMaster API data
    } else {
      acc.push(event);
    }
    return acc;
  }, []);

  return uniqueEvents;
};

// does not make API Call
const getSampleEvents = async () => {
  parseData(events);
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
    // keep eventSource as 'ticketmaster' if it is from TicketMaster, otherwise set it to 'edmtrain.com'
    item.eventSource =
      item.eventSource === "ticketmaster" ? "ticketmaster" : "edmtrain.com";
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
