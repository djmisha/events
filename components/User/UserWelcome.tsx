import { useContext } from "react";
import Link from "next/link";
import styles from "./UserWelcome.module.scss";
import { cityOrState } from "../../utils/utilities";
import Button from "../Button/Button";
import { AppContext } from "../../features/AppContext";

interface Location {
  id: number;
  city: string | null;
  state: string;
  slug: string;
}

interface UserWelcomeProps {
  defaultLocation: Location | null;
}

const UserWelcome = ({ defaultLocation }: UserWelcomeProps) => {
  const { profile } = useContext(AppContext);

  if (!profile) return null;

  const displayName = profile.username || profile.full_name || "there";

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
            <p>You haven&apos;t set a default location yet.</p>
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
