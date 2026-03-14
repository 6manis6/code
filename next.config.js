/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["i.ibb.co", "ibb.co"],
  },
};

module.exports = nextConfig;
