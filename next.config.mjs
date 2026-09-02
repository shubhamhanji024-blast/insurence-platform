/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack config (Next.js 16+)
  turbopack: {},

  // Webpack passthrough (keeps existing webpack-based behavior intact)
  webpack: (config) => config,

  // Allow localtunnel and ngrok domains for public sharing / testing
  allowedDevOrigins: [
    'loca.lt',
    '*.loca.lt',
    'ngrok.io',
    '*.ngrok.io',
    '*.ngrok-free.app',
  ],

  // Suppress workspace root warning
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
