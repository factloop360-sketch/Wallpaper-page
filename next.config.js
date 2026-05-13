/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allows all Supabase storage buckets
      },
    ],
  },
};

module.exports = nextConfig;