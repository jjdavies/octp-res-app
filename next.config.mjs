/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
    ],
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '40mb',
    },
  },
};

export default nextConfig;
