import Link from "next/link";
import styles from "./UserWelcome.module.scss";
import { User } from "@supabase/supabase-js";
import { cityOrState } from "../../utils/utilities";
import Button from "../Button/Button";

interface Location {
  id: number;
  city: string | null;
  state: string;
  slug: string;
}

interface Profile {
  username: string;
  full_name: string;
  default_location_id?: number | string; // Accept either number or string
}

interface UserWelcomeProps {
  user: User;
  profile: Profile | null;
  defaultLocation: Location | null;
}

const UserWelcome = ({ user, profile, defaultLocation }: UserWelcomeProps) => {
  if (!user) return null;

  const displayName =
    profile?.username ||
    profile?.full_name ||
    user.email?.split("@")[0] ||
    "there";

  // For debugging
  console.log("User Welcome Props:", {
    user: !!user,
    profile,
    defaultLocation,
  });

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <h2 className={styles.welcomeHeading}>
          Welcome back, <span className={styles.userName}>{displayName}</span>!
        </h2>

        {defaultLocation ? (
          <div className={styles.locationInfo}>
            <p>
              Your default location is set to{" "}
              <span className={styles.locationName}>
                {cityOrState(defaultLocation.city, defaultLocation.state)}
              </span>
            </p>
            <Button
              href={`/events/${defaultLocation.slug}`}
              variant="primary"
              onClick={null}
              className={null}
            >
              View events in{" "}
              {cityOrState(defaultLocation.city, defaultLocation.state)}
            </Button>
          </div>
        ) : (
          <div className={styles.locationInfo}>
            <p>You haven&quote;t set a default location yet.</p>
            <Button
              href="/profile"
              variant="primary"
              onClick={null}
              className={null}
            >
              Set your default location
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWelcome;
