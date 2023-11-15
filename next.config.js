/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'media.graphassets.com',
            port: '',
            pathname: '/**',
            // pathname: '/account123/**',
          },
        ],
      },
}

module.exports = nextConfig
