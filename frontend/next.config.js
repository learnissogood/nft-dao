/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: [
    "cdn.stamp.fyi"
  ]},
}

module.exports = nextConfig
