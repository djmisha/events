import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import { toSlug } from "../../utils/getLocations";
import styles from "./Hamburger.module.scss";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const { locationCtx } = useContext(AppContext);

  return (
    <>
      <div className={styles["top-nav-bar"]}>
        <div className={styles["nav-burger"]} onClick={handleClick}>
          <Image
            width={25}
            height={25}
            src="/images/icon-bars-solid.svg"
            alt="Menu"
          />
          <span>Menu</span>
        </div>
      </div>
      <div
        className={
          isOpen
            ? `${styles["nav-overlay"]} ${styles["nav-open"]}`
            : `${styles["nav-overlay"]} ${styles["nav-closed"]}`
        }
      >
        <div className={styles["nav-close"]} onClick={handleClick}>
          <Image
            width={25}
            height={25}
            src="/images/icon-close.svg"
            alt="Menu"
          />
          <span>Close</span>
        </div>

        <div className={styles["nav-items"]}>
          <Link href="/" onClick={handleClick}>
            Home
          </Link>
          <Link href="/artists">Top Artists</Link>
          <Link href="/cities">Events by City</Link>
          <Link href="/states">Events by State</Link>
        </div>
        {locationCtx?.length > 0 && (
          <div className={styles["recently-viewed"]}>
            <span>Recently Viewed</span>
            <ul>
              {locationCtx?.map((location, index) => (
                <li key={location.state}>
                  {location.city ? (
                    <Link
                      href={`/events/${toSlug(location.city)}`}
                      onClick={handleClick}
                    >
                      {location.city}, {location.state}
                    </Link>
                  ) : (
                    <Link
                      href={`/events/${toSlug(location.state)}`}
                      onClick={handleClick}
                    >
                      {location.state}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles["bottom-items"]}>
          <div className={styles["social-items"]}>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://twitch.tv/sdhousemusic/"
              className={styles["twitch"]}
            >
              <Image
                width={40}
                height={40}
                src="/images/icon-twitch.svg"
                alt="Menu"
              />
              <span>Twitch</span>
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.instagram.com/sdhousemusic/"
              className={styles["instagram"]}
            >
              <Image
                width={40}
                height={40}
                src="/images/icon-instagram.svg"
                alt="Menu"
              />
              <span>Instagram</span>
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.facebook.com/San-Diego-House-Music-135772356433768/"
              className={styles["facebook"]}
            >
              <Image
                width={40}
                height={40}
                src="/images/icon-facebook.svg"
                alt="Menu"
              />
              <span>Facebook</span>
            </a>
          </div>
          <Image
            width={200}
            height={67}
            src="/images/logo.jpeg"
            alt="sandiegohousemusic.com"
            className={styles["logo"]}
          />
        </div>
      </div>
    </>
  );
};

export default Hamburger;
