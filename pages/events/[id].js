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

export async function getServerSideProps({ params, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=21600, stale-while-revalidate=21600"
  );

  const locationData = getLocationData(params.id);
  const events = await getEvents(locationData);

  return {
    props: {
      locationData,
      events,
    },
  };
}
