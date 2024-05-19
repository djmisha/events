import { useEffect, useRef } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import Link from "next/link";
import { getArtistsCounts } from "../utils/getArtists";
import ArtistImage from "../components/Artists/ArtistImage";
import { ToSlugArtist } from "../utils/utilities";
import Navigation from "../components/Navigation/Navigation";
import GoogleAutoAds from "../components/3rdParty/googleAds";

const title = "Top Touring EDM DJ's & Artists";

/**
 * Gets server side data for page,
 * revalidates every 1 month
 *
 * @param {*} param0
 * @returns all events on EDM Train
 */
export async function getStaticProps() {
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = "https://edmtrain.com/api/events?";
  const URL = EDMURL + "&client=" + KEY;

  let apiResponse;

  try {
    apiResponse = await fetch(URL);
  } catch (error) {
    console.error("Fetch failed: ", error);
    throw new Error(`Fetch failed: ${error.message}`);
  }

  if (!apiResponse.ok) {
    throw new Error(`HTTP error! status: ${apiResponse.status}`);
  }

  const json = await apiResponse.json();
  const events = getArtistsCounts(json.data);

  return {
    props: {
      events,
    },
    revalidate: 2419200, // 1 month
  };
}

const Artists = ({ events }) => {
  const topArtists = events.slice(0, 200);
  const apiEvents = events.slice(0, 30);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && apiEvents) {
      // TODO: Extract into a func
      async function postData() {
        let response;
        try {
          response = await fetch(
            // "http://localhost:3000/api/supabase/posttopartists",
            "https://sandiegohousemusic.com/api/supabase/posttopartists",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(apiEvents),
            }
          );
        } catch (error) {
          console.error("Fetch failed: ", error);
          throw new Error(`Fetch failed: ${error.message}`);
        }
      }

      postData();
      hasFetched.current = true;
    }
  }, [apiEvents]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
        <GoogleAutoAds />
      </Head>
      <Navigation />
      <>
        <h1>Top Touring Artists</h1>
        <div className="top-artists-list">
          {topArtists?.map((item) => {
            const { id, name, count } = item;
            return (
              <Link href={`/artist/${ToSlugArtist(name)}`} key={id}>
                <div className="top-artists-single" key={name}>
                  <ArtistImage name={name} />
                  <div className="top-artists-single-name">
                    {name} <span>{count} shows</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </>
    </Layout>
  );
};

export default Artists;
