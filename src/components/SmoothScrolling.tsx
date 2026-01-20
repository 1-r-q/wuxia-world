"use client";
import React from "react";
import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";

function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 특정 페이지에서 Lenis 비활성화 (휠 스크롤 문제)
  const disableLenis = pathname === '/characters';
  
  if (disableLenis) {
    return (
      <div style={{ 
        width: '100%', 
        minHeight: '100vh',
        position: 'relative'
      }}>
        {children}
      </div>
    );
  }

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        smoothWheel: true,
      }}
    >
      <div style={{ 
        width: '100%', 
        minHeight: '100vh',
        position: 'relative'
      }}>
        {children}
      </div>
    </ReactLenis>
  );
}

export default SmoothScrolling;
