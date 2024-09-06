module.exports = {
    images: {
        domains: ['media.giphy.com'], // Added the hostname to the images config
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ]
    },
  }