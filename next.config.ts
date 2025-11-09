import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow images from Unsplash used in the sample data
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
