

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media.giphy.com'], // Added the hostname to the images config
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "https://subtitle-ai-seven.vercel.app/api/:path*"
            : "/api/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "https://subtitle-ai-seven.vercel.app/docs"
            : "/api/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "https://subtitle-ai-seven.vercel.app/openapi.json"
            : "/api/openapi.json",
      },
    ];
  },
};

module.exports = nextConfig;