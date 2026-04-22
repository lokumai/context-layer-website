/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
};

export default nextConfig;
