import Head from "next/head";
import styles from "./layout.module.css";
import Link from "next/link";
import Script from "next/script";

export const siteTitle = "Find EDM Events";

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

        <link rel="apple-touch-icon" href="/images/housemusic512.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <main>{children}</main>
      {/* {!home && (
        <div>
          <Link href="/">← Back to home</Link>
        </div>
      )} */}
      {process.env.NODE_ENV != "development" && (
        <div>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=UA-115514301-1"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'UA-115514301-1');
            `}
          </Script>
        </div>
      )}
    </div>
  );
}
