import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getLocations } from "../utils/getLocations";
import HomeSearchAutocomplete from "../components/SearchAutoComplete/HomeSearchAutocomplete";
import Locator from "../components/Locator/Locator";
import CitiesStates from "../components/Homepage/CitiesStates";
import Navigation from "../components/Navigation/Navigation";
import TopArtists from "../components/Homepage/TopArtists";
import Link from "next/link";
// import TicketMaster from "../components/TicketMaster/TicketMaster";

export async function getServerSideProps() {
  const locations = getLocations();

  // PUT THIS BLOCK INTO A SEPERATE FILE
  const res = await fetch(
    "https://sandiegohousemusic.com/api/supabase/gettopartists"
  );
  const topArtists = await res.json();

  if (!res.ok) {
    console.error("Error fetching data: ", res.status);
    return {
      notFound: true,
    };
  }
  // PUT THIS BLOCK INTO A SEPERATE FILE

  return {
    props: {
      locations,
      topArtists,
    },
  };
}

export default function Home({ locations, topArtists }) {
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
      <Navigation />
      {/* <TicketMaster /> */}
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
        <TopArtists artists={topArtists.data} />
        <CitiesStates locations={locations} />
      </section>
      <footer>
        <br></br>
        Created by{" "}
        <Link href="https://djmisha.com" target="_blank" title="San Diego DJ">
          San Diego DJ
        </Link>
      </footer>
    </Layout>
  );
}
