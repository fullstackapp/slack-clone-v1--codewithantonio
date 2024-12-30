/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aware-frog-755.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
