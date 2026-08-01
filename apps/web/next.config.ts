import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@transport-platform/design-tokens',
    '@transport-platform/ui-web',
    '@transport-platform/supabase',
    '@transport-platform/observability',
  ],
};

export default nextConfig;
