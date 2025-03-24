import { useContext } from "react";
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
  const { profile } = useContext(AppContext);
  const DEFAULT_ICON = "/images/icon-user.svg";

  const renderContent = () => {
    if (!profile) {
      return {
        href: "/login",
        iconSrc: DEFAULT_ICON,
        iconAlt: "Login",
        text: "Login",
      };
    }

    return {
      href: "/dashboard",
      iconSrc: profile.avatar_url || DEFAULT_ICON,
      iconAlt: profile.username || "Profile",
      text: profile.username || "Profile",
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
