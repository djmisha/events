import Script from "next/script";

function GoogleAutoAds() {
  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6261738507723190"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        async
      />
    </>
  );
}

export default GoogleAutoAds;
