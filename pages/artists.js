import { useEffect, useRef } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import { getArtistsCounts } from "../utils/getArtists";
import { filterSurpriseGuest } from "../utils/utilities";
import NavigationBar from "../components/Navigation/NavigataionBar";
import TopArtistsCard from "../components/TopArtistsCard/TopArtistsCard";
import styles from "../styles/Artists.module.scss";

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
  const uniqueArtists = getArtistsCounts(json.data);

  return {
    props: {
      uniqueArtists,
    },
    revalidate: 2419200, // 1 month
  };
}

const Artists = ({ uniqueArtists }) => {
  const filteredArtists = filterSurpriseGuest(uniqueArtists);
  const topArtists = filteredArtists.slice(0, 200);
  const apiEvents = filteredArtists.slice(0, 30);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && apiEvents) {
      async function postData() {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/supabase/posttopartists`,
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
      </Head>
      <NavigationBar />
      <>
        <h1>Top Touring Artists</h1>
        <div className={styles.artistsList}>
          {topArtists?.map((artist) => (
            <TopArtistsCard key={artist.id} artist={artist} />
          ))}
        </div>
      </>
    </Layout>
  );
};

export default Artists;
