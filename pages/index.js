import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import HomeSearchAutocomplete from "../components/SearchAutoComplete/HomeSearchAutocomplete";
import Locator from "../components/Locator/Locator";
import CitiesStates from "../components/Homepage/CitiesStates";
import Navigation from "../components/Navigation/Navigation";

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </Head>
      <Navigation />
      <section className="one">
        <div className="hero-home">
          <div>
            <h1>Find EDM Events</h1>
            <p>Discover dance music near you </p>
          </div>
          <div className="home-search">
            <HomeSearchAutocomplete />
          </div>
        </div>
        <Locator locations={locations} />
      </section>
      <section className="two">
        <CitiesStates locations={locations} />
      </section>
    </Layout>
  );
}
