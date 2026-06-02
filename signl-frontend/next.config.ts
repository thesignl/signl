import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Allow editorial cover images from any HTTPS source until a CDN
  // is configured. Author-curated images are sourced externally;
  // permissive remotePatterns lets next/image render them safely.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['zustand'],
  },
}

export default nextConfig
