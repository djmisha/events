/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "music.sandiegohousemusic.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "djmisha.com",
        pathname: "/wordpress/wp-content/**",
      },
    ],
  },
  reactStrictMode: true,
  exportPathMap: async function (defaultPathMap) {
    const paths = { ...defaultPathMap };
    delete paths["/auth/confirm"];
    return paths;
  },
};

module.exports = nextConfig;
