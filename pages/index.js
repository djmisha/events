import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import Login from "../components/Account/Login";
import Hamburger from "../components/Hamburger/Hamburger";
import LocationAutoComplete from "../components/SearchAutoComplete/LocationAutoComplete";
import Locator from "../components/Locator/Locator";

export async function getServerSideProps() {
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
      <Hamburger />
      <div className="hero-home">
        <div>
          <h1>Find EDM Events</h1>
          <p>Discover dance music in a city near you </p>
        </div>
        <div className="home-search">
          <LocationAutoComplete />
        </div>
        <Locator locations={locations} />
      </div>
      <Login />
    </Layout>
  );
}
