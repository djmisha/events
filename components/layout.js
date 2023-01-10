import Head from "next/head";
import styles from "./layout.module.css";
import Link from "next/link";

export const siteTitle = "House Music Events & DJ Mixes";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/housemusic48.png" />
        <meta
          name="description"
          content="Find house music and dance events in a city near you. Listen to DJ mixes from around the world. Let's Party!"
        />
        <meta property="og:image" content="/images/housemusic512.png" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>{children}</main>
      {/* {!home && (
        <div>
          <Link href="/">← Back to home</Link>
        </div>
      )} */}
    </div>
  );
}
