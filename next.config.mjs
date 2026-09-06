/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://100.27.186.67:8000/:path*",
      },
    ];
  },
};

export default nextConfig;