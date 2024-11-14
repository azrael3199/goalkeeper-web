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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/*/**',
      },
    ],
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com'],
  },
};

export default nextConfig;
