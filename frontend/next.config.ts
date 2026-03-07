import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 환경에서 frontend → backend 프록시
  // 브라우저는 localhost:3000만 알면 됨 (backend:4000 직접 노출 없음)
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
