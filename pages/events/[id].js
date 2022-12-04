import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/layout";
import { getLocationIds, getLocationData } from "../../utils/getLocations";
import EventCard from "../../components/EventCard/EventCard";

export default function Location({ locationData }) {
  const title = `Events in ${locationData.city}, ${locationData.state}`;
  const [events, SetEvents] = useState([]);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const getEvents = async () => {
      const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
      const URL = process.env.NEXT_PUBLIC_API_URL_EDMTRAIN;
      const PATH = URL + locationData.id + "&client=" + KEY;
      await fetch(PATH)
        .then(function (response) {
          response.json().then((res) => {
            SetEvents(res.data);
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getEvents();
  }, []);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>Events Near {locationData.city || locationData.state}</h1>
      <section>
        {events &&
          events.map((event, index) => {
            return <EventCard event={event} key={index} />;
          })}
      </section>
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
