import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./PageNotFound.module.scss";

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
    <div className={styles.errorContainer}>
      <div className={styles.errorCard}>
        <h1>404 - Page Not Found</h1>
        <p className={styles.message}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.redirectMessage}>
          <p>
            Redirecting to {redirectTarget} in{" "}
            <strong>{countdown} seconds</strong>...
          </p>
          <button onClick={handleRedirect} className={styles.button}>
            Go {redirectTarget === "previous page" ? "Back" : "Home"} Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
