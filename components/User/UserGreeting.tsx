import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import styles from "./UserGreeting.module.scss";
import { AppContext } from "../../features/AppContext";

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
  const { supabase } = useContext(AppContext);

  const DEFAULT_ICON = "/images/icon-user.svg";

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
  }, [supabase]);

  const renderContent = () => {
    if (!user) {
      return {
        href: "/login",
        iconSrc: DEFAULT_ICON,
        iconAlt: "Login",
        text: "Login",
      };
    }

    return {
      href: "/profile",
      iconSrc: profile?.avatar_url || DEFAULT_ICON,
      iconAlt: profile?.username || "Profile",
      text: profile?.username || "Profile",
    };
  };

  const { href, iconSrc, iconAlt, text } = renderContent();

  return (
    <div className={styles.loginContainer}>
      <Link href={href} className={styles.loginLink}>
        <img src={iconSrc} alt={iconAlt} className={styles.loginIcon} />
        {text && <div>{text}</div>}
      </Link>
    </div>
  );
};

export default UserGreeting;
