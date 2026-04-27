import type { NextConfig } from 'next';
import path from 'node:path';

const config: NextConfig = {
  reactStrictMode: true,

  sassOptions: {
    // `loadPaths` is the modern dart-sass key; `includePaths` is the legacy
    // alias still honoured by some loaders. Declaring both keeps webpack and
    // Turbopack happy across the tree, regardless of source-file depth.
    loadPaths: [path.join(process.cwd(), 'src/styles')],
    includePaths: [path.join(process.cwd(), 'src/styles')],
    silenceDeprecations: ['legacy-js-api', 'import'],
  },

  experimental: {
    optimizePackageImports: ['gsap', 'three'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default config;
