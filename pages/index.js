import Head from "next/head";
import { useContext, useEffect } from "react";
import Verify from "../components/Auth/Verify";
import Footer from "../components/Footer/Footer";
import CitiesStates from "../components/Homepage/CitiesStates";
import Hero from "../components/Homepage/Hero";
import SignupCTA from "../components/Homepage/SignupCTA";
import TopArtists from "../components/Homepage/TopArtists";
import WelcomeMessage from "../components/Homepage/WelcomeMessage";
import Layout, { siteTitle } from "../components/layout";
import Locator from "../components/Locator/Locator";
import NavigationBar from "../components/Navigation/NavigataionBar";
import UserWelcome from "../components/User/UserWelcome";
import { AppContext } from "../features/AppContext";
import { getLocations } from "../utils/getLocations";
import { createClient as createServerClient } from "../utils/supabase/server-props";

export async function getServerSideProps(context) {
  const locations = getLocations();

  // Use server-side client to check authentication status
  const supabase = createServerClient(context);
  const { data: userData } = await supabase.auth.getUser();

  // Get user data if logged in
  const user = userData?.user || null;
  let profile = null;
  let defaultLocation = null;

  // If user is logged in, fetch their profile
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*") // Fetch all fields instead of just specific ones
      .eq("id", user.id)
      .single();

    profile = profileData || null;

    // If profile has default location, fetch the location data
    if (profile?.default_location_id) {
      // Convert default_location_id to number to ensure correct comparison
      const locationId = parseInt(profile.default_location_id, 10);

      // Find the location in the locations array
      defaultLocation = locations.find((loc) => loc.id === locationId) || null;
    }
  }

  return {
    props: {
      locations,
      profile,
      defaultLocation,
    },
  };
}

export default function Home({ locations, profile, defaultLocation }) {
  const isLoggedIn = !!profile;
  const { setProfile } = useContext(AppContext);

  // Update AppContext with profile data when component mounts
  useEffect(() => {
    if (profile) setProfile(profile);
  }, [profile, setProfile]);

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
      <Verify />
      <Hero />
      {!isLoggedIn && <WelcomeMessage />}
      {isLoggedIn ? (
        <>
          <UserWelcome defaultLocation={defaultLocation} />
        </>
      ) : (
        <Locator locations={locations} />
      )}
      <section className="two">
        <TopArtists />
        {!isLoggedIn && <SignupCTA />}
        <CitiesStates locations={locations} />
      </section>

      <Footer />
    </Layout>
  );
}
