import Head from "next/head";
import Layout from "../../components/layout";
import { getLocationData } from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModule from "../../components/EventsModule/EventsModule";
import getEvents from "../../utils/getEvents";

export default function Location({ locationData, events }) {
  const { city, state, id } = locationData;
  const title = makePageTitle(city, state);
  const description = makePageDescription(city, state);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <EventsModule key={id} locationData={locationData} events={events} />
    </Layout>
  );
}

export async function getServerSideProps({ params, res }) {
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

  const events = await getEvents(locationData.id);

  return {
    props: {
      locationData,
      events,
    },
  };
}
