import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import { UserLocationService } from "../utils/getIpAddress";
import { useEffect, useRef, useState } from "react";

export async function getStaticProps() {
  const locations = getLocations();
  return {
    props: {
      locations,
    },
  };
}

export default function Home({ locations }) {
  const [locationID, SetLocationID] = useState();

  useEffect(() => {
    UserLocationService();
  }, []);

  // this not gonna work, refactor!
  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("locID"));
    if (id) SetLocationID(id);
  }, []);

  console.log(locationID);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {/* <section>Your City {location}</section> */}
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
