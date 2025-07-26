import React, { useEffect, useState } from "react";

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
    <div className="mb-6">
      <h1 className="text-sm text-gray-800 relative border-none animate-fade-in">
        Good {timeOfDay}, {displayName}
      </h1>
    </div>
  );
};

export default Greeting;
