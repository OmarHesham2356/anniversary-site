import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Signed Cloudinary delivery URLs point at res.cloudinary.com.
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
