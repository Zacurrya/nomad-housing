import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      }
    ]
  },
  images: {
    // allow images from Unsplash used in the sample data
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
