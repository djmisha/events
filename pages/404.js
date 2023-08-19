import { useEffect } from "react";
import Layout from "../components/layout";

const Custom404 = () => {
  // redirect to homepager after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }, []);

  return (
    <Layout>
      <h1>404 - Page Not Found</h1>
      <p>Redirecting to homepage...</p>
    </Layout>
  );
};

export default Custom404;
