import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import HomeSearchAutocomplete from "../components/SearchAutoComplete/HomeSearchAutocomplete";
import Locator from "../components/Locator/Locator";
import CitiesStates from "../components/Homepage/CitiesStates";
import TopArtists from "../components/Homepage/TopArtists";
import Link from "next/link";
import NavigationBar from "../components/Navigation/NavigataionBar";
import Hero from "../components/Homepage/Hero";
import Footer from "../components/Footer/Footer";

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
          name="impact-site-verification"
          value="5cfd0d65-e35f-46d0-888f-cd6252e7d10c"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </Head>
      <NavigationBar />
      <Hero />
      <Locator locations={locations} />
      <section className="two">
        <TopArtists />
        <CitiesStates locations={locations} />
      </section>
      <Footer />
    </Layout>
  );
}
