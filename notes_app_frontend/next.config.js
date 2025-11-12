/**
 * Next.js configuration.
 * Keep configuration simple to avoid impacting chunking/runtime resolution.
 */
const nextConfig = {
  // Highlight potential issues in development
  reactStrictMode: true,
  // Use SWC minification (default true on modern Next, explicit here)
  swcMinify: true,
  // Standalone output improves Docker/serverless deployment by bundling required files
  output: 'standalone',
  // Do not alter routing paths in a way that could interfere with chunk resolution
  trailingSlash: false,
};

export default nextConfig;
