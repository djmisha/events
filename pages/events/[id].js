import Head from "next/head";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModule from "../../components/EventsModule/EventsModule";
import Hamburger from "../../components/Hamburger/Hamburger";
import getEvents from "../../utils/getEvents";

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
      <Hamburger />
      <EventsModule locationData={locationData} events={events} />
    </Layout>
  );
}

// Gets slugs for each dynamic page
export async function getStaticPaths() {
  const paths = await getLocationIds();

  const validPaths = paths.filter(
    (path) => path?.params?.id && typeof path.params.id === "string"
  );

  return {
    paths: validPaths,
    fallback: false,
  };
}

/**
 * Gets data for each page based on slug
 * @param {*} params
 * @returns locationData
 */
export async function getStaticProps({ params }) {
  const locationData = getLocationData(params.id);
  const events = await getEvents(locationData.id);

  return {
    props: {
      locationData,
      events,
    },
    revalidate: 21600, // Revalidate every 6 hours
  };
}
