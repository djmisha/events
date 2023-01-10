/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // {
      //   source: "/events/",
      //   destination: "/",
      //   permanent: true,
      // },
      {
        source: "/:slug",
        destination: "https://music.sandiegohousemusic.com/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
