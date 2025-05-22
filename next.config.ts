import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'picsum.photos',
      'localhost' // caso utilize imagens locais
    ],
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['@nodelib/fs.scandir'],

  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          path: false,
          os: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;