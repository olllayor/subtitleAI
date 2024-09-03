module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*', // Adjust this to your backend URL
        },
      ]
    },
  }