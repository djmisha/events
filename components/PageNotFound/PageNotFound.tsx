import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PageNotFound = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [redirectTarget, setRedirectTarget] = useState("/");

  useEffect(() => {
    // Check if user came from another page in our site
    const hasPreviousPage =
      window &&
      window.history.length > 1 &&
      document.referrer.includes(window.location.hostname);

    // Set the redirect target based on history
    const target = hasPreviousPage ? "previous page" : "homepage";
    setRedirectTarget(target);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      if (hasPreviousPage) {
        router.back();
      } else {
        router.push("/");
      }
    }, 3000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const handleRedirect = () => {
    if (redirectTarget === "previous page") {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] p-8">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-lg w-full [&_h1]:mb-4 [&_h1]:text-3xl">
        <h1>404 - Page Not Found</h1>
        <p className="mb-8 text-gray-600">
          The page you&lsquo;re looking for doesn&lsquo;t exist or has been
          moved.
        </p>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p>
            Redirecting to {redirectTarget} in{" "}
            <strong>{countdown} seconds</strong>...
          </p>
          <button
            onClick={handleRedirect}
            className="bg-blue-600 text-white border-none py-2 px-4 rounded cursor-pointer text-base mt-4 transition-colors duration-200 hover:bg-blue-700"
          >
            Go {redirectTarget === "previous page" ? "Back" : "Home"} Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
