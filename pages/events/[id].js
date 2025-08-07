import Head from "next/head";
import Layout from "../../components/layout";
import {
  getLocationData,
  isStateLandingPage,
  getStateInfo,
} from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModule from "../../components/EventsModule/EventsModule";
import StateLandingPage from "../../components/StateLandingPage/StateLandingPage";
import { getSDHMEvents, parseData } from "../../utils/getEvents";

export default function Location({
  locationData,
  events,
  initialPage,
  eventId,
  isState,
  stateInfo,
}) {
  // If this is a state landing page
  if (isState && stateInfo) {
    const title = makePageTitle(null, stateInfo.name);
    const description = makePageDescription(null, stateInfo.name);

    // If state has cities, show city links
    if (stateInfo.hasCities) {
      return (
        <Layout>
          <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
          </Head>
          <StateLandingPage
            stateName={stateInfo.name}
            cities={stateInfo.cities}
            locationData={{
              id: stateInfo.id,
              city: null,
              state: stateInfo.name,
              slug: stateInfo.slug,
            }}
          />
        </Layout>
      );
    }

    // If state has no cities, show events directly (like a city page)
    return (
      <Layout>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Head>
        <EventsModule
          key={stateInfo.id}
          locationData={{
            id: stateInfo.id,
            city: null,
            state: stateInfo.name,
            slug: stateInfo.slug,
          }}
          events={events}
          initialPage={initialPage}
          eventId={eventId}
        />
      </Layout>
    );
  }

  // Default behavior for city/regular location pages
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

  const slug = params.id;

  // Check if this is a state landing page
  if (isStateLandingPage(slug)) {
    const stateInfo = getStateInfo(slug);

    if (!stateInfo) {
      return {
        notFound: true,
      };
    }

    // If state has cities, return state landing page data
    if (stateInfo.hasCities) {
      return {
        props: {
          isState: true,
          stateInfo,
          locationData: {}, // Empty object to prevent errors
          events: [],
          initialPage: 1,
        },
      };
    }

    // If state has no cities, fetch events directly via EDM TRAIN API
    let events = [];
    try {
      // Only fetch if this is actually a state-only request (no city)
      if (!stateInfo.city) {
        const apiUrl = `${req ? `http://${req.headers.host}` : ""}/api/events/${
          stateInfo.id
        }`;
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data = await response.json();
          events = data.data || [];
          parseData(events); // Ensure events are parsed correctly
        } else {
          console.error(`API response error: ${response.status}`);
          events = [];
        }
      } else {
        console.warn("Skipping state API call - city present in location data");
        events = [];
      }
    } catch (error) {
      console.error("Error fetching events from local API for state:", error);
      events = [];
    }

    // Get the initial page from query parameters, default to 1
    const initialPage = parseInt(query.page) || 1;

    return {
      props: {
        isState: true,
        stateInfo,
        locationData: {
          id: stateInfo.id,
          city: null,
          state: stateInfo.name,
          slug: stateInfo.slug,
        },
        events,
        initialPage,
      },
    };
  }

  // Default behavior for city/regular location pages
  const locationData = getLocationData(slug);

  if (!locationData.id) {
    return {
      notFound: true,
    };
  }

  // Call the SDHM API and process events
  let events = [];
  try {
    events = await getSDHMEvents(locationData.id, locationData.city);
  } catch (error) {
    console.error("Error fetching events from SDHM API:", error);
    events = [];
  }

  // Get the initial page from query parameters, default to 1
  const initialPage = parseInt(query.page) || 1;

  return {
    props: {
      isState: false,
      locationData,
      events,
      initialPage,
    },
  };
}
