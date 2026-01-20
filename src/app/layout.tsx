import type { Metadata } from "next";
import { Noto_Serif_KR, Nanum_Myeongjo, Noto_Sans_KR, Gowun_Batang } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import AudioManager from "@/components/AudioManager";
import { BgmController } from "@/components/BgmController";
import GlobalNav from "@/components/GlobalNav";



// 제목용 - 비장하고 묵직한 명조체
const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "900"],
  variable: "--font-noto-serif",
  display: "swap",
});

// 고전적인 바탕체 - 서책 느낌
const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun-batang",
  display: "swap",
});

// 필사체 느낌의 명조
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

// 본문용 - 가독성 좋은 고딕
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "이 무림에 낙원은 없다 (此武林無桃源)",
  description: "무협 세계관 소개 사이트 - 강호의 영웅과 세력들을 만나보세요",
  keywords: ["무협", "wuxia", "이 무림에 낙원은 없다", "세계관", "소개"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`
          ${notoSerifKr.variable} 
          ${nanumMyeongjo.variable} 
          ${gowunBatang.variable}
          ${notoSansKr.variable}
          font-serif
          antialiased 
          bg-black 
          text-stone-100
          selection:bg-amber-900/50 
          selection:text-amber-100
        `}
      >
        <AudioManager>
          <BgmController />
          <SmoothScrolling>
            {/* 글로벌 네비게이션 */}
            <GlobalNav />
            {/* 한지 질감 오버레이 */}
            <div className="paper-overlay pointer-events-none" />
            {children}
          </SmoothScrolling>
        </AudioManager>
      </body>
    </html>
  );
}
