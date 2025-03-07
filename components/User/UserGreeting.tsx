import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/component";
import Link from "next/link";
import styles from "./UserGreeting.module.scss";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
}

const UserGreeting = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUserAndProfile() {
      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // If user exists, get profile
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    }

    getUserAndProfile();
  }, []);

  if (!user) {
    return (
      <div className={styles.loginContainer}>
        <Link href="/login" className={styles.loginLink}>
          <img
            src="/images/icon-user.svg"
            alt="Login"
            className={styles.loginIcon}
          />
          <div>Login</div>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.greetingContainer}>
      <Link href="/profile" className={styles.profileLink}>
        {profile?.username && <div>Hello, {profile?.username}!</div>}
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className={styles.avatar}
          />
        )}
      </Link>
    </div>
  );
};

export default UserGreeting;
