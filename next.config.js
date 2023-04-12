/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'nifty-league.s3.amazonaws.com',
      'lh3.googleusercontent.com',
      'dl.openseauserdata.com',
    ],
  },
};

module.exports = nextConfig;
