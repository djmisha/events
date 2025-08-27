import React, { useState, useEffect } from "react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const handleClick = () => scroll(0, 0);

  useEffect(() => {
    const handleScroll = () => {
      const distanceFromTop = window.scrollY;
      if (distanceFromTop > 1000) setVisible(true);
      if (distanceFromTop < 1000) setVisible(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed flex justify-center items-center bottom-16 right-4 bg-black text-white rounded-full w-9 h-9 text-center font-bold z-10 transition-all duration-200 ease-in-out cursor-pointer ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClick}
    >
      &uarr;
    </div>
  );
};

export default BackToTop;
