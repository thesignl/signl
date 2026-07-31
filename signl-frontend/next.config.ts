import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Pin the file-tracing root to this app. The repo contains multiple
  // package-lock.json files (root + frontend); without this, Next infers the
  // wrong workspace root and warns. Explicit root = correct standalone tracing.
  outputFileTracingRoot: rootDir,

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
