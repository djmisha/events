import { useContext } from "react";
import Link from "next/link";
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
    <div className="p-4 py-4 px-2 bg-gray-50 rounded-lg my-4">
      <div>
        <h2 className="text-3xl sm:text-2xl font-semibold mb-4">
          Welcome back,{" "}
          <span className="font-semibold text-gray-900">{displayName}</span>!
        </h2>

        {defaultLocation ? (
          <div className="text-lg sm:text-base text-gray-600 mb-6">
            <p>
              Your default location is set to{" "}
              <span className="font-semibold text-gray-900">
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
          <div className="text-lg sm:text-base text-gray-600 mb-6">
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
