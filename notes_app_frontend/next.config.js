const nextConfig = {
  // Enable React strict mode to highlight potential problems
  reactStrictMode: true,
  // Standalone output improves Docker/serverless deployment by bundling required files
  output: 'standalone'
};

export default nextConfig;
