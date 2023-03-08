/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["maps.gstatic.com"],
    },
};

module.exports = nextConfig
