import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2400],
  },
}

export default nextConfig
