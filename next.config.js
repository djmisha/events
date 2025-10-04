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
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://www.grooverooster.com/",
        permanent: true,
      },
      {
        source: "/(.*)",
        destination: "https://www.grooverooster.com/$1",
        permanent: true,
      },
    ];
  },
  exportPathMap: async function (defaultPathMap) {
    const paths = { ...defaultPathMap };
    delete paths["/auth/confirm"];
    return paths;
  },
};

module.exports = nextConfig;
