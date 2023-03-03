import React, { useState, useEffect } from "react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const handleClick = () => scroll(0, 0);

  useEffect(() => {
    const handleScroll = () => {
      const distanceFromTop = window.scrollY;
      if (distanceFromTop > 200) setVisible(true);
      if (distanceFromTop < 200) setVisible(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`back-to-top ${visible ? "b-visible" : "b-hidden"}`}
      onClick={handleClick}
    >
      &uarr;
    </div>
  );
};

export default BackToTop;
