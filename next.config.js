/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['static.debank.com'], // Add this for DeBank images
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'stats.aicrostrategy.com',
            },
          ],
          destination: '/stats',
        },
      ],
    }
  },
}

module.exports = nextConfig 