import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://taskflow-api-ltm0.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;