import type { User } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import UserDashboard from "../components/User/UserDashboard";
import { createClient as createServerClient } from "../utils/supabase/server-props";
import { getLocations } from "../utils/getLocations";

interface UserProfile {
  id: string;
  default_location_id?: string | number;
  [key: string]: any; // Allow other profile properties
}

interface DashboardProps {
  user: User;
  profile: UserProfile | null;
  defaultLocation: any;
}

export default function DashboardPage({
  user,
  profile,
  defaultLocation,
}: DashboardProps) {
  return (
    <UserDashboard
      user={user}
      profile={profile}
      defaultLocation={defaultLocation}
    />
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
  let profile: UserProfile | null = null;
  let defaultLocation: any = null;

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
      const locationId = parseInt(String(profile.default_location_id), 10);

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
