import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow PayHere / ngrok tunnels to load dev client bundles (HMR + hydration).
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;
