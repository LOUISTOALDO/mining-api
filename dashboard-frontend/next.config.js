/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is stable in Next.js 14 - no experimental flag needed
  typescript: {
    // Enable TypeScript error checking in production
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable ESLint error checking in production
    ignoreDuringBuilds: false,
  }
}

module.exports = nextConfig
