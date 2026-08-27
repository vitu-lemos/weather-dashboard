import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.ALLOWED_DEV_HOSTS ?? ""],
};

export default nextConfig;
