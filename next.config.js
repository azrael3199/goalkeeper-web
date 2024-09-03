/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['!server'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/*/**',
      },
    ],
  },
};

module.exports = nextConfig;
