/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // BACKEND_URI: "http://localhost:4000",
    BACKEND_URI: "https://chiko-backend.vercel.app",
  },
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
