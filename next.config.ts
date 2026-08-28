import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.ALLOWED_DEV_HOSTS ?? ""],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
