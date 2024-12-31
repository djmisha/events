import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout";

const Custom404 = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <Layout>
      <h1>404 - Page Not Found</h1>
      <p>
        Redirecting to homepage in <strong>{countdown} seconds</strong>...
      </p>
    </Layout>
  );
};

export default Custom404;
