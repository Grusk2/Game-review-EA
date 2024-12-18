import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true, // Enable the App Directory feature
  } as unknown as NextConfig["experimental"], // Type cast workaround
};

export default nextConfig;
