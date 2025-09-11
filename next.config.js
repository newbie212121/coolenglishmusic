/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1uqdf1080xgw5.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;