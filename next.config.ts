import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Path renames over the corporate site's history. All permanent so search
      // index and external links follow the move.
      // /portfolio retired in the AI news + consulting reset (2026-10-10);
      // /products and /pmos point straight at /about so nothing chains.
      { source: '/portfolio', destination: '/about', permanent: true },
      { source: '/products', destination: '/about', permanent: true },
      { source: '/products/:path*', destination: '/about', permanent: true },
      // /pmos retired in the products-first redesign (2026-05-15) — pmOS is
      // internal-only now.
      { source: '/pmos', destination: '/about', permanent: true },
      { source: '/pmos/:path*', destination: '/about', permanent: true },
    ];
  },
};

export default nextConfig;
