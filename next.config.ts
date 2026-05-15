import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /products → /portfolio (renamed for the blueprint redesign 2026-05).
      // Permanent so external links and search index follow the move.
      { source: '/products', destination: '/portfolio', permanent: true },
      { source: '/products/:path*', destination: '/portfolio', permanent: true },
    ];
  },
};

export default nextConfig;
