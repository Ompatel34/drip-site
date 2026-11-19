import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Pin the project root (a stray package-lock.json in the user folder confuses detection).
  turbopack: { root: path.resolve(".") },
  images: {
    // Unsplash photos are hotlinked (never re-hosted), as Unsplash requires.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // Serve modern formats; next/image picks the smallest the browser supports.
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      { source: "/help", destination: "/faq", permanent: true },
      { source: "/how-we-make", destination: "/materials", permanent: true },
    ]
  },
}

export default nextConfig
