import type { User } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import EditProfile from "../components/User/EditProfile";
import ArtistSearch from "../components/User/ArtistSearch";
import { createClient as createServerClient } from "../utils/supabase/server-props";

interface ProfileFormProps {
  user: User;
}

export default function ProfilePage({ user }: ProfileFormProps) {
  return (
    <>
      <EditProfile user={user} />
      {user && (
        <ArtistSearch
          userId={user.id}
          onArtistAdded={() => {
            // Optionally add logic to refresh any data that needs to be updated
          }}
        />
      )}
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
