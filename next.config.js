/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
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
};

module.exports = nextConfig;
