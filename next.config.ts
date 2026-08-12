import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Firebase App Hosting can optimize images when real village photos are added.
    unoptimized: false,
  },
};

export default nextConfig;
