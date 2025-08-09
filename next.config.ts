import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["big-app.s3.amazonaws.com","app.big.delivery"],
  },
};

export default nextConfig;
