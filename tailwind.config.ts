import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1a1a",
        foreground: "#e5e5e5",
        ink: "#0a0a0a",
        paper: "#f0f0f0",
        blood: "#8b0000",
      },
      fontFamily: {
        // 제목용 - 비장한 명조체
        serif: ["var(--font-noto-serif)", "var(--font-gowun-batang)", "serif"],
        // 고전 서책 느낌
        batang: ["var(--font-gowun-batang)", "var(--font-noto-serif)", "serif"],
        // 필사체 명조
        myeongjo: ["var(--font-nanum-myeongjo)", "serif"],
        // 가독성 좋은 고딕
        sans: ["var(--font-noto-sans)", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'ink-spread': 'radial-gradient(circle, transparent 0%, black 100%)',
      },
      animation: {
        'ink-spread': 'inkSpread 0.8s ease-out forwards',
        'brush-stroke': 'brushStroke 1.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        inkSpread: {
          '0%': { clipPath: 'circle(0% at 50% 100%)' },
          '100%': { clipPath: 'circle(150% at 50% 100%)' },
        },
        brushStroke: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,255,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255,255,255,0.6)' },
        },
      },
      // dvh 단위 지원
      height: {
        screen: ['100vh', '100dvh'],
        'screen-dvh': '100dvh',
      },
      minHeight: {
        screen: ['100vh', '100dvh'],
        'screen-dvh': '100dvh',
      },
    },
  },
  plugins: [],
};
export default config;
