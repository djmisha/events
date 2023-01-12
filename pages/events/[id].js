import Head from "next/head";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../utils/utilities";
import EventsModule from "../../components/EventsModule/EventsModule";

export default function Location({ locationData }) {
  const { city, state } = locationData;
  const title = makePageTitle(city, state);
  const description = makePageDescription(city, state);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <EventsModule locationData={locationData} />
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

// Gets data for each page based on slug
export async function getStaticProps({ params }) {
  const locationData = getLocationData(params.id);
  return {
    props: {
      locationData,
    },
  };
}
