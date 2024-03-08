import Head from "next/head";
import Layout from "../components/layout";
import Link from "next/link";
import Hamburger from "../components/Hamburger/Hamburger";
import { getArtistsCounts } from "../utils/getArtists";
import ArtistImage from "../components/Artists/ArtistImage";
import { ToSlugArtist } from "../utils/utilities";

const title = "Top Touring EDM Artists";

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
  const apiResponse = await fetch(URL);

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

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </Head>
      <Hamburger />
      <>
        <h1>Top Touring Artists</h1>
        <div className="top-artists-list">
          {topArtists &&
            topArtists.map((item) => {
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
