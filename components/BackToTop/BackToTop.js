import React, { useState, useEffect } from "react";
import styles from "./BackToTop.module.scss";

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
      className={`${styles.backToTop} ${
        visible ? styles.visible : styles.hidden
      }`}
      onClick={handleClick}
    >
      &uarr;
    </div>
  );
};

export default BackToTop;
