/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aiworknav.cn" }],
        destination: "https://aiworknav.cn/:path*",
        permanent: true
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "ai-tools-navigator-navy.vercel.app" }],
        destination: "https://aiworknav.cn/:path*",
        permanent: true
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "ai-tools-navigator-doifis-projects.vercel.app" }],
        destination: "https://aiworknav.cn/:path*",
        permanent: true
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "ai-tools-navigator-doifi-doifis-projects.vercel.app" }],
        destination: "https://aiworknav.cn/:path*",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
