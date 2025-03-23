import type { User } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import UserDashboard from "../components/User/UserDashboard";
import { createClient as createServerClient } from "../utils/supabase/server-props";
import NavigationBar from "../components/Navigation/NavigataionBar";

interface DashboardProps {
  user: User;
}

export default function DashboardPage({ user }: DashboardProps) {
  return (
    <>
      <NavigationBar events={[]} setSearchTerm={() => {}} locationData={{}} />
      <UserDashboard user={user} />;
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Use server-side client for getServerSideProps
  const supabase = createServerClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user,
    },
  };
}
