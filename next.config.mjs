/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force webpack (Turbopack native bindings unavailable on this machine)
  webpack: (config) => config,

  // Allow localtunnel and ngrok domains for public sharing
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
