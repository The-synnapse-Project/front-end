import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  },
  async rewrites() {
    return [
      {
        // Forward API requests to the Rocket API
        source: '/api/bridge/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
