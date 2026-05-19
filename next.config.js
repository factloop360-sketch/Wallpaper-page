/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-518d6ddd1158470e905f52e633c1350f.r2.dev', // Your exact R2 public domain
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Whitelists your legacy Supabase storage
      }
    ],
  },
};

export default nextConfig; // (Use module.exports = nextConfig; if it's a .js file)