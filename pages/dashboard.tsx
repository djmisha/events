import type { User } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import UserDashboard from "../components/User/UserDashboard";
import { createClient as createServerClient } from "../utils/supabase/server-props";
import NavigationBar from "../components/Navigation/NavigataionBar";
import { getLocations } from "../utils/getLocations";

interface DashboardProps {
  user: User;
  profile: any;
  defaultLocation: any;
}

export default function DashboardPage({
  user,
  profile,
  defaultLocation,
}: DashboardProps) {
  return (
    <>
      <NavigationBar events={[]} setSearchTerm={() => {}} locationData={{}} />
      <UserDashboard
        user={user}
        profile={profile}
        defaultLocation={defaultLocation}
      />
      ;
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Use server-side client for getServerSideProps
  const supabase = createServerClient(context);
  const locations = getLocations();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Get user data if logged in
  const user = data.user;
  let profile = null;
  let defaultLocation = null;

  // If user is logged in, fetch their profile
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
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
      user: user,
      profile,
      defaultLocation,
    },
  };
}
