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

export default function Artist({ artistData }) {
  const { name, id } = artistData;
  const [events, setEvents] = useState();
  const eventDataFetchedRef = useRef();
  const [lastFMDdata, setLastFMDdata] = useState();
  const title = `${name} - Upcoming Events & Artist Informaton`;
  const description = `${name} Tour Dates, Shows, Concert Tickets & Live Streams. Learn more about ${name}`;

  useEffect(() => {
    if (eventDataFetchedRef.current === id) return;
    eventDataFetchedRef.current = id;
    getArtistEvents(id, setEvents);
  }, [id]);

  useEffect(() => {
    // Determine URL to use based on env
    const setURL = (name) => {
      let url;

      if (process.env.NODE_ENV === "development") {
        url = `http://localhost:3000/api/lastfm/artistgetinfo/${name}`;
      } else {
        url = `https://sandiegohousemusic.com/api/lastfm/artistgetinfo/${name}`;
      }

      return url;
    };

    const url = setURL(name);

    const fetchLastFMData = async (url) => {
      try {
        const response = await fetch(url, {
          mode: "no-cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    fetchLastFMData(url)
      .then((lastFMData) => {
        console.log("Fetched data:", lastFMData);
        setLastFMDdata(lastFMData);
        // Do something with lastFMData
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [name]);

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
        {lastFMDdata && <ArtistBio lastFMDdata={lastFMDdata} />}
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

  return {
    props: {
      artistData,
    },
  };
}
