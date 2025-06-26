import Head from "next/head";
import Layout from "../../components/layout";
import { getLocationData } from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModule from "../../components/EventsModule/EventsModule";
import getEvents from "../../utils/getEvents";

export default function Location({ locationData, events, initialPage }) {
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
      />
    </Layout>
  );
}

export async function getServerSideProps({ params, query, res }) {
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
