import type { User } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import NavigationBar from "../components/Navigation/NavigataionBar";
import EditProfile from "../components/User/EditProfile";
import { createClient as createServerClient } from "../utils/supabase/server-props";

interface ProfileFormProps {
  user: User;
}

export default function ProfilePage({ user }: ProfileFormProps) {
  return (
    <>
      <NavigationBar setSearchTerm={() => {}} locationData={{}} />
      <EditProfile user={user} />
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
