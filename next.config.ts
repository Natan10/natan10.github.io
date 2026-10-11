import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without these, opening the dev server via 127.0.0.1 or a LAN IP (phone
  // testing) blocks the dev JS, so the page never hydrates and commands/buttons
  // do nothing.
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*"],
};

export default nextConfig;
