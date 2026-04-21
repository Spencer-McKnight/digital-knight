import type { NextConfig } from 'next';
import path from 'node:path';

const config: NextConfig = {
  reactStrictMode: true,

  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/styles')],
    silenceDeprecations: ['legacy-js-api', 'import'],
  },

  experimental: {
    optimizePackageImports: ['gsap', '@react-three/drei', 'three'],
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
