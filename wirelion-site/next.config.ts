import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is statically generated; there is no server-side data.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
