import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import {
  getAritstIds,
  getArtistData,
  getArtistEvents,
} from "../../utils/getArtists";
import ArtistImage from "../../components/Artists/ArtistImage";
import ArtistBio from "../../components/Artists/ArtistBio";
import EventCard from "../../components/EventCard/EventCard";
import Hamburger from "../../components/Hamburger/Hamburger";
import GoogleAutoAds from "../../components/3rdParty/googleAds";

export default function Artist({ artistData, lastFMDdata }) {
  const { name, id } = artistData;
  const [events, setEvents] = useState();
  const dataFetchedRef = useRef();
  const title = `${name} - Upcoming Events & Artist Informaton`;
  const description = `${name} Tour Dates, Shows, Concert Tickets & Live Streams. Learn more about ${name}`;

  useEffect(() => {
    if (dataFetchedRef.current === id) return;
    dataFetchedRef.current = id;
    getArtistEvents(id, setEvents);
  }, [id]);

  console.log(lastFMDdata);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <GoogleAutoAds />
      </Head>
      <Hamburger />
      <div className="artist">
        <div className="artist-header">
          <ArtistImage name={name} />
          <h1>{name}</h1>
        </div>
        <ArtistBio lastFMDdata={lastFMDdata} />
        <h2>{name} Events</h2>
        <div id="artistfeed">
          {events?.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

// Gets slugs for each dynamic page
export async function getStaticPaths() {
  const paths = getAritstIds();
  return {
    paths,
    fallback: false,
  };
}

/**
 * Gets data for each page based on slug
 * @param {*} params
 * @returns locationData
 */
export async function getStaticProps({ params }) {
  const artistData = await getArtistData(params.id);

  const { name } = artistData;
  const lastFMDquery = await fetch(
    `https://sandiegohousemusic.com/api/lastfm/artistgetinfo/${name}`
  );
  const lastFMDdata = await lastFMDquery.json();

  return {
    props: {
      artistData,
      lastFMDdata,
    },
  };
}
