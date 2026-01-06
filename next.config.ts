import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "cdn.pixelbin.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pedraimages.s3.eu-west-3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lquiwmvtjlactwiwnjyt.supabase.co",
      }
    ]
  }
};

export default nextConfig;
