import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="nav-burger" onClick={handleClick}>
        <Image
          width={25}
          height={25}
          src="/images/icon-bars-solid.svg"
          alt="Menu"
        />
        <span>Menu</span>
      </div>
      <div
        className={isOpen ? "nav-overlay nav-open" : "nav-overlay nav-closed"}
      >
        <Image
          width={200}
          height={67}
          src="/images/logo.jpeg"
          alt="sandiegohousemusic.com logo"
          className="logo"
        />
        <div className="nav-items">
          <Link href="/" onClick={handleClick}>
            Events
          </Link>
          <Link href="https://music.sandiegohousemusic.com">Music</Link>
          <Link href="https://music.sandiegohousemusic.com/submit-your-dj-mix/">
            Submit DJ Mix
          </Link>
        </div>
        <div className="social-items">
          <a
            rel="noreferrer"
            target="_blank"
            href="https://twitch.tv/sdhousemusic/"
            className="twitch"
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
            className="instagram"
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
            className="facebook"
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
      </div>
    </>
  );
};

export default Hamburger;
