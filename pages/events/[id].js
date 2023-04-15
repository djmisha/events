import Head from "next/head";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModuleSinglePage from "../../components/EventsModule/EventsModuleSinglePage";
// import EventsModule from "../../components/EventsModule/EventsModule";
import { parseData } from "../../utils/getEvents";

export default function Location({ locationData, events }) {
  const { city, state } = locationData;
  const title = makePageTitle(city, state);
  const description = makePageDescription(city, state);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      {/* <EventsModule locationData={locationData} /> */}
      <EventsModuleSinglePage locationData={locationData} events={events} />
    </Layout>
  );
}

// Gets slugs for each dynamic page
export async function getStaticPaths() {
  const paths = getLocationIds();
  return {
    paths,
    fallback: false,
  };
}

/**
 * Gets data for each page based on slug
 * @param {*} param0
 * @returns locationData, events
 */
export async function getStaticProps({ params }) {
  const locationData = getLocationData(params.id);
  const { id } = locationData;
  const apiResponse = await fetch(
    `https://sandiegohousemusic.com/api/events/${id}`
  );
  const events = await apiResponse.json();
  parseData(events.data);

  return {
    props: {
      locationData,
      events,
    },
    // revalidate: 43200,
  };
}
