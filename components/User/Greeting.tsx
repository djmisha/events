import React, { useEffect, useState } from "react";
import styles from "./Greeting.module.scss";

interface GreetingProps {
  username?: string;
  email?: string;
}

const Greeting: React.FC<GreetingProps> = ({ username, email }) => {
  const [timeOfDay, setTimeOfDay] = useState<string>("");

  useEffect(() => {
    const determineTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return "morning";
      } else if (hour >= 12 && hour < 18) {
        return "afternoon";
      } else {
        return "evening";
      }
    };

    setTimeOfDay(determineTimeOfDay());

    // Optionally update the greeting if user views page across time boundaries
    const timer = setInterval(() => {
      setTimeOfDay(determineTimeOfDay());
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  // Determine display name (username > email prefix > "User")
  const displayName = username || (email ? email.split("@")[0] : "User");

  return (
    <div className={styles.greetingContainer}>
      <h2 className={styles.greetingText}>
        Good {timeOfDay}, {displayName}
      </h2>
    </div>
  );
};

export default Greeting;
