/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // Fix workspace root warning
  outputFileTracingRoot: require('path').join(__dirname),
};

module.exports = nextConfig;
