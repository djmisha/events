import type { User } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import ChangePassword from "../components/User/ChangePassword";
import { createClient as createServerClient } from "../utils/supabase/server-props";

interface ChangePasswordPageProps {
  user: User;
}

export default function ChangePasswordPage({ user }: ChangePasswordPageProps) {
  return (
    <>
      <ChangePassword user={user} />
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
