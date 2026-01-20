import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // 이미지 최적화 설정
  images: {
    unoptimized: true, // 정적 내보내기 시 필요
  },
  
  // 빌드 최적화
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
