import { useEffect } from "react";

const Custom404 = () => {
  // redirect to homepager after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }, []);

  return (
    <>
      <h1>404 - Page Not Found</h1>
      <p>Redirecting to homepage...</p>
    </>
  );
};

export default Custom404;
