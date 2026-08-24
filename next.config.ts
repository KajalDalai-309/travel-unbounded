import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using webpack for production build (Turbopack has known CSS PostCSS issues in v16)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
