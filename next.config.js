/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "music.sandiegohousemusic.com",
        // port: "8080",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:slug",
        destination: "https://music.sandiegohousemusic.com/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
