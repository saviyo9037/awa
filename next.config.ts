import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/amin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/amin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
