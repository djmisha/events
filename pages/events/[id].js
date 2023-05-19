import Head from "next/head";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModuleSinglePage from "../../components/EventsModule/EventsModuleSinglePage";
import { parseData } from "../../utils/getEvents";
import Login from "../../components/Account/Login";
import Hamburger from "../../components/Hamburger/Hamburger";

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
      <EventsModuleSinglePage locationData={locationData} events={events} />
      <Login />
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
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const URL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
  const PATH = URL + id + "&client=" + KEY;

  const apiResponse = await fetch(PATH);
  // const apiResponse = await fetch(
  //   `https://sandiegohousemusic.com/api/events/${id}`
  // );
  const events = await apiResponse.json();
  parseData(events.data);

  return {
    props: {
      locationData,
      events,
    },
    revalidate: 21600,
  };
}
