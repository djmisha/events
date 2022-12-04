import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";

export async function getStaticProps() {
  const locations = getLocations();
  return {
    props: {
      locations,
    },
  };
}

export default function Home({ locations }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        {locations.map(({ id, city, state, slug }) => (
          <Link href={`/events/${slug}/`} key={id}>
            <p>{city || state}</p>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
