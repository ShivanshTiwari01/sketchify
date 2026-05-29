import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: '../../',
  },
  reactCompiler: true,
};

export default nextConfig;
