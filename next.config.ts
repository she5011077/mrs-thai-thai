import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oxjjqqsflhsidggcfmdd.supabase.co',
      },
    ],
  },
};

export default nextConfig;
