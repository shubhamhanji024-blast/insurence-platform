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

  // Security Headers — applied to every response at the edge
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
