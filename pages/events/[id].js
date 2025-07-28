import Head from "next/head";
import Layout from "../../components/layout";
import { getLocationData } from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModule from "../../components/EventsModule/EventsModule";
import {
  sortEventsByDate,
  removeDuplicateEvents,
  filterPastEvents,
} from "../../utils/getEvents";

// !TODO: THIS IS TEMPORARY, REFACTOR TO USE SDHM API ACROSS THE WHOLE APP
import { transformEventsArray } from "../../utils/eventTransformer";

export default function Location({
  locationData,
  events,
  initialPage,
  eventId,
}) {
  const { city, state, id } = locationData;
  const title = makePageTitle(city, state);
  const description = makePageDescription(city, state);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <EventsModule
        key={id}
        locationData={locationData}
        events={events}
        initialPage={initialPage}
        eventId={eventId}
      />
    </Layout>
  );
}

export async function getServerSideProps({ params, query, req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=21600, stale-while-revalidate=21600"
  );

  const locationData = getLocationData(params.id);

  if (!locationData.id) {
    return {
      notFound: true,
    };
  }

  // const events = await getEvents(locationData.id, locationData.city);

  // Call the new SDHM API route directly
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = req.headers.host;
  const apiUrl = `${protocol}://${host}/api/sdhm/${locationData.id}/${locationData.city}`;

  let events = [];
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      const rawEvents = data.data;
      // !TODO - this is temporary, refactor when SDHM API is fully integrated
      const sorted = sortEventsByDate(rawEvents);
      const deduped = removeDuplicateEvents(sorted);
      // Transform the new API data to match the legacy format
      events = transformEventsArray(deduped);
      events = filterPastEvents(events);
    }
  } catch (error) {
    console.error("Error fetching events from SDHM API:", error);
    events = [];
  }

  // Get the initial page from query parameters, default to 1
  const initialPage = parseInt(query.page) || 1;

  return {
    props: {
      locationData,
      events,
      initialPage,
    },
  };
}
