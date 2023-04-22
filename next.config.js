/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "music.sandiegohousemusic.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
