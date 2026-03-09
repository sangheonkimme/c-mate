import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 환경에서 frontend → backend 프록시
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

  // SVG를 React 컴포넌트로 import 가능하게
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false, // SVG 최적화 비활성화 (currentColor 유지)
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
