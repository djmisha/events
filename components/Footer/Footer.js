import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.logo}>
          <Image
            width={200}
            height={67}
            src="/images/logo.jpeg"
            alt="sandiegohousemusic.com"
          />
        </div>

        <div className={styles.navigation}>
          <h3>Navigation</h3>
          <Link href="/">Home</Link>
          <Link href="/artists">Top Artists</Link>
          <Link href="/cities">Events by City</Link>
          <Link href="/states">Events by State</Link>
          <Link href="/login">Login / Signup</Link>
        </div>

        <div className={styles.partners}>
          <h3>Partners</h3>
          <Link href="https://djmisha.com" target="_blank" title="San Diego DJ">
            San Diego DJ
          </Link>
          <Link href="https://edmtrain.com" target="_blank">
            EDM Train
          </Link>
          <Link href="https://www.last.fm" target="_blank">
            Last Fm
          </Link>
        </div>

        <div className={styles.social}>
          <h3>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://twitch.tv/sdhousemusic/"
              className={styles.twitch}
            >
              <Image
                width={24}
                height={24}
                src="/images/icon-twitch.svg"
                alt="Twitch"
              />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.instagram.com/sdhousemusic/"
              className={styles.instagram}
            >
              <Image
                width={24}
                height={24}
                src="/images/icon-instagram.svg"
                alt="Instagram"
              />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.facebook.com/San-Diego-House-Music-135772356433768/"
              className={styles.facebook}
            >
              <Image
                width={24}
                height={24}
                src="/images/icon-facebook.svg"
                alt="Facebook"
              />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} sandiegohousemusic.com. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
