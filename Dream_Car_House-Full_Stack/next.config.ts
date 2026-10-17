import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "192.168.10.191",
    "192.168.10.191:3000",
    "192.168.10.191:3001",
    "localhost",
    "localhost:3000",
    "localhost:3001",
    "127.0.0.1",
    "127.0.0.1:3000",
    "127.0.0.1:3001",
  ],
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home07.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home07",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/compare-1.html",
        destination: "/compare",
        permanent: false,
      },
      {
        source: "/compare-1",
        destination: "/compare",
        permanent: false,
      },
      {
        source: "/my-favorites.html",
        destination: "/my-favorite",
        permanent: false,
      },
      {
        source: "/my-favorites",
        destination: "/my-favorite",
        permanent: false,
      },
      {
        source: "/properties-list.html",
        destination: "/add-listing",
        permanent: false,
      },
      {
        source: "/properties-list",
        destination: "/add-listing",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
