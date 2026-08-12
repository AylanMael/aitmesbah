import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    // Firebase App Hosting can optimize images when real village photos are added.
    unoptimized: false,
  },
};

export default nextConfig;
