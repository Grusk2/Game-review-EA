import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true, // Enable the App Directory feature
  } as unknown as NextConfig["experimental"], // Type cast workaround

  images: {
    domains: ["media.rawg.io"], // ✅ Allow external images from RAWG API
  },

  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint during Vercel builds
  },
};

export default nextConfig;
