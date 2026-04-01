import type { NextConfig } from "next";

const NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};


export default NextConfig as NextConfig;
