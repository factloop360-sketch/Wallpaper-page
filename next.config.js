/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables the "use server" feature for your Navbar logout function
  experimental: {
    serverActions: true,
  },
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