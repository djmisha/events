import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { AppContext } from "../../features/AppContext";
import { toSlug } from "../../utils/getLocations";
import styles from "./Hamburger.module.scss";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";

const LocationLink = ({ city, state, onClick }) => {
  const href = `/events/${toSlug(city || state)}`;
  const label = city ? `${city}, ${state}` : state;

  return (
    <Link href={href} onClick={onClick} shallow={false}>
      {label}
    </Link>
  );
};

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locationCtx } = useContext(AppContext);

  const handleClose = () => {
    setIsOpen(false);
  };

  const menuContent = (
    <>
      <div className={styles["nav-items"]}>
        <Link href="/" onClick={handleClose}>
          Home
        </Link>
        <Link href="/artists" onClick={handleClose}>
          Top Artists
        </Link>
        <Link href="/cities" onClick={handleClose}>
          Events by City
        </Link>
        <Link href="/states" onClick={handleClose}>
          Events by State
        </Link>
      </div>

      {locationCtx?.length > 0 && (
        <div className={styles["recently-viewed"]}>
          <span>Recently Viewed</span>
          <ul>
            {locationCtx?.map((location) => (
              <li key={`${location.city}-${location.state}`}>
                <LocationLink
                  city={location.city}
                  state={location.state}
                  onClick={handleClose}
                />
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
    </>
  );

  return (
    <>
      <div className={styles["top-nav-bar"]}>
        <MenuTrigger
          icon="/images/icon-bars-solid.svg"
          text="Menu"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        {menuContent}
      </MenuOverlay>
    </>
  );
};

export default Hamburger;
