"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudio } from "./AudioManager";

const NAV_ITEMS = [
  { href: "/", label: "이 무림에 낙원은 없다", sublabel: "入口", hanja: "門" },
  { href: "/characters", label: "인물록", sublabel: "人物錄", hanja: "人" },
];

// 세력 바로가기 - 옥패 스타일
const FACTION_QUICK_LINKS = [
  { id: 'orthodox', label: '정파', hanja: '正', color: '#60a5fa' },
  { id: 'unorthodox', label: '사파', hanja: '邪', color: '#f97316' },
  { id: 'demonic', label: '마교', hanja: '魔', color: '#ef4444' },
  { id: 'outer', label: '세외', hanja: '外', color: '#22d3ee' },
];

export default function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { playClick, playHover } = useAudio();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // 메인 페이지, 문파 상세 페이지, 인물록 페이지에서는 네비게이션 숨김
  if (pathname === "/" || pathname?.startsWith("/factions") || pathname?.startsWith("/characters")) return null;

  return (
    <>
      {/* ========== 시네마틱 상단 헤더 ========== */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          
          {/* 좌측: 로고 + 타이틀 */}
          <Link href="/" onClick={playClick} onMouseEnter={playHover}>
            <motion.div 
              className="flex items-center gap-4 group"
              whileHover={{ scale: 1.02 }}
            >
              {/* 붉은 인장 아이콘 */}
              <div className="relative w-10 h-10 rounded border-2 border-red-600/60 flex items-center justify-center group-hover:border-red-500 transition-colors">
                <span className="text-red-500 font-myeongjo text-lg group-hover:text-red-400 transition-colors">
                  武
                </span>
                {/* 인장 글로우 */}
                <div className="absolute inset-0 rounded bg-red-500/10 group-hover:bg-red-500/20 transition-colors" />
              </div>
              
              {/* 타이틀 */}
              <div>
                <h1 className="text-xl md:text-2xl font-myeongjo text-white/90 group-hover:text-white transition-colors tracking-wide">
                  이 무림에 낙원은 없다
                </h1>
                <p className="text-[10px] text-amber-400/60 tracking-[0.3em] group-hover:text-amber-400/80 transition-colors">
                  此武林無桃源
                </p>
              </div>
            </motion.div>
          </Link>

          {/* 중앙: 세력 퀵 네비게이션 (데스크톱만) */}
          <nav className="hidden lg:flex items-center gap-2">
            {FACTION_QUICK_LINKS.map((faction, i) => (
              <motion.div
                key={faction.id}
                className="relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/?group=${faction.id}`}>
                  <motion.div
                    className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center cursor-pointer transition-all group-hover:bg-white/15 group-hover:border-white/30"
                    style={{ 
                      color: faction.color,
                    }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    <span className="font-myeongjo text-base">{faction.hanja}</span>
                  </motion.div>
                </Link>
                
                {/* 툴팁 */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                  <span className="text-xs text-white/80">{faction.label}</span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/10 rotate-45" />
                </div>
              </motion.div>
            ))}
          </nav>

          {/* 우측: 유틸리티 버튼들 */}
          <div className="flex items-center gap-3">
            {/* 인물록 버튼 */}
            <Link href="/characters">
              <motion.div 
                className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border flex items-center justify-center transition-all ${
                  pathname === '/characters' 
                    ? 'border-amber-400/50 text-amber-400' 
                    : 'border-white/20 text-white/60 hover:bg-white/20 hover:border-amber-400/50 hover:text-amber-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={playHover}
                onClick={playClick}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>
            </Link>

            {/* 메뉴 버튼 */}
            <motion.button
              className={`w-10 h-10 flex flex-col items-center justify-center gap-1 bg-white/10 backdrop-blur-md rounded-full border transition-all ${
                isOpen ? 'border-amber-400/50' : 'border-white/20 hover:border-white/40'
              }`}
              onClick={() => {
                playClick();
                setIsOpen(!isOpen);
              }}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="w-4 h-0.5 bg-white/80 rounded-full"
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5 : 0 }}
              />
              <motion.span
                className="w-4 h-0.5 bg-white/80 rounded-full"
                animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
              />
              <motion.span
                className="w-4 h-0.5 bg-white/80 rounded-full"
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5 : 0 }}
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ========== 풀스크린 메뉴 ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 w-screen h-screen min-h-[100dvh] z-[150] bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 배경 패턴 */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`
              }}
            />

            {/* 배경 한자 */}
            <motion.div
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-[15vw] font-myeongjo text-white/5">
                江湖
              </h2>
            </motion.div>

            {/* 네비게이션 링크 */}
            <nav className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      playClick();
                      setIsOpen(false);
                    }}
                    onMouseEnter={playHover}
                    className={`group flex items-center gap-6 px-8 py-5 rounded-xl transition-all ${
                      pathname === item.href 
                        ? 'bg-white/10 border border-amber-400/30' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {/* 한자 아이콘 */}
                    <div 
                      className={`w-14 h-14 rounded-lg border flex items-center justify-center font-myeongjo text-2xl transition-all ${
                        pathname === item.href 
                          ? 'border-amber-400/50 text-amber-400 bg-amber-400/10'
                          : 'border-white/20 text-white/40 group-hover:border-amber-400/30 group-hover:text-amber-400'
                      }`}
                    >
                      {item.hanja}
                    </div>
                    
                    <div>
                      <span className={`text-3xl md:text-4xl font-myeongjo transition-colors ${
                        pathname === item.href 
                          ? 'text-amber-400' 
                          : 'text-white/80 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                      <span className="block text-sm text-white/30 tracking-[0.3em] mt-1">
                        {item.sublabel}
                      </span>
                    </div>
                    
                    {pathname === item.href && (
                      <motion.span 
                        className="text-amber-400/60 text-sm ml-4"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ← 현재
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* 세력 바로가기 - 옥패 스타일 */}
              <motion.div
                className="mt-12 pt-8 border-t border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white/30 text-sm mb-6 tracking-[0.2em]">세력 바로가기</p>
                
                <div className="flex items-center justify-center gap-4">
                  {FACTION_QUICK_LINKS.map((faction, i) => (
                    <motion.div
                      key={faction.id}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                    >
                      <Link 
                        href={`/?group=${faction.id}`}
                        onClick={() => {
                          playClick();
                          setIsOpen(false);
                        }}
                        onMouseEnter={playHover}
                      >
                        <motion.div
                          className="w-16 h-16 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all group-hover:border-white/30"
                          style={{ 
                            boxShadow: `0 4px 20px ${faction.color}20`,
                          }}
                          whileHover={{ scale: 1.15, y: -8, boxShadow: `0 8px 30px ${faction.color}40` }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span 
                            className="font-myeongjo text-2xl transition-all group-hover:scale-110"
                            style={{ color: faction.color }}
                          >
                            {faction.hanja}
                          </span>
                          <span className="text-[10px] text-white/40 mt-1 group-hover:text-white/60">
                            {faction.label}
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </nav>

            {/* 닫기 안내 */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="px-3 py-1.5 bg-white/10 rounded-md text-white/40 text-xs">ESC</span>
              <span className="text-white/30 text-sm">또는 메뉴 버튼으로 닫기</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
