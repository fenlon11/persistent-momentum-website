import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Path renames over the corporate site's history. All permanent so search
      // index and external links follow the move.
      { source: '/products', destination: '/portfolio', permanent: true },
      { source: '/products/:path*', destination: '/portfolio', permanent: true },
      // /pmos retired in the products-first redesign (2026-05-15) — pmOS is
      // internal-only now. Old inbound links land on /portfolio.
      { source: '/pmos', destination: '/portfolio', permanent: true },
      { source: '/pmos/:path*', destination: '/portfolio', permanent: true },
    ];
  },
};

export default nextConfig;
