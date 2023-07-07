import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import Login from "../components/Account/Login";
import Hamburger from "../components/Hamburger/Hamburger";
import { getArtistsCounts } from "../utils/getArtists";
import ArtistImage from "../components/Artists/ArtistImage";

/**
 * Gets server side data for page,
 * revalidate every 5 days
 *
 * @param {*} param0
 * @returns all events on EDM Train
 */
export async function getStaticProps() {
  const apiResponse = await fetch(
    `https://sandiegohousemusic.com/api/allevents/`
  );

  const json = await apiResponse.json();
  const events = getArtistsCounts(json.data);

  return {
    props: {
      events,
    },
    revalidate: 432000, // 5 days
  };
}

export default function Home({ events }) {
  const top = events;
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </Head>
      <Hamburger />
      <>
        <h1>Top Touring Artists</h1>
        <div className="top-artists-list">
          {top &&
            top.map((item, index) => {
              if (index < 50) {
                const { name, count } = item;
                return (
                  <div className="top-artists-single" key={name}>
                    <ArtistImage name={name} />
                    <div className="top-artists-single-name">
                      {name} <span>{count} shows</span>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </>
      <Login />
    </Layout>
  );
}
