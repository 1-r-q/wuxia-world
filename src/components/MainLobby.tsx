"use client";

import React, { useRef, useMemo, useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FACTIONS, Faction, FactionCategory } from "@/data/factions";
import { getCharactersByFaction } from "@/data/characters";
import Link from "next/link";
import VisualEngine from "./VisualEngine";
import { useAudio } from "./AudioManager";

interface MainLobbyProps {
  group: string;
  subGroup?: string; // 'gupaeilbang' | 'odaesega' (정파 전용)
  onBack: () => void;
}

// 그룹별 테마 - 정통 무협 스타일
const GROUP_THEME: Record<string, { 
  title: string; 
  subtitle: string; 
  desc: string;
  bgColor: string;
  hoverBgColor: string;
  accentColor: string;
  glowColor: string;
  inkColor: string;
}> = {
  'orthodox': { 
    title: '정파', 
    subtitle: '正派',
    desc: '의리와 정의를 수호하는 무림의 기둥',
    bgColor: 'rgba(25, 28, 35, 0.95)',
    hoverBgColor: 'rgba(30, 40, 55, 0.98)',
    accentColor: 'rgba(100, 150, 200, 0.85)',
    glowColor: 'rgba(80, 130, 180, 0.3)',
    inkColor: 'rgba(70, 100, 140, 0.12)',
  },
  'gupaeilbang': { 
    title: '구파일방', 
    subtitle: '九派一幇',
    desc: '무림 정도의 아홉 문파와 천하제일방',
    bgColor: 'rgba(28, 25, 20, 0.95)',
    hoverBgColor: 'rgba(40, 35, 25, 0.98)',
    accentColor: 'rgba(201, 162, 39, 0.9)',
    glowColor: 'rgba(201, 162, 39, 0.3)',
    inkColor: 'rgba(180, 140, 40, 0.12)',
  },
  'odaesega': { 
    title: '오대세가', 
    subtitle: '五大世家',
    desc: '혈통으로 전해지는 절대 무학의 가문',
    bgColor: 'rgba(20, 25, 35, 0.95)',
    hoverBgColor: 'rgba(25, 35, 50, 0.98)',
    accentColor: 'rgba(36, 113, 163, 0.9)',
    glowColor: 'rgba(36, 113, 163, 0.3)',
    inkColor: 'rgba(40, 100, 150, 0.12)',
  },
  'unorthodox': {
    title: '사파',
    subtitle: '邪派', 
    desc: '약육강식의 법칙을 따르는 그들만의 도력',
    bgColor: 'rgba(28, 30, 25, 0.95)',
    hoverBgColor: 'rgba(40, 50, 35, 0.98)',
    accentColor: 'rgba(140, 180, 100, 0.85)',
    glowColor: 'rgba(100, 150, 70, 0.3)',
    inkColor: 'rgba(90, 120, 60, 0.12)',
  },
  'demonic': {
    title: '마교',
    subtitle: '魔教',
    desc: '천마를 숭배하는 마도의 추종자들',
    bgColor: 'rgba(35, 25, 28, 0.95)',
    hoverBgColor: 'rgba(50, 30, 35, 0.98)',
    accentColor: 'rgba(200, 100, 100, 0.85)',
    glowColor: 'rgba(180, 80, 80, 0.3)',
    inkColor: 'rgba(140, 60, 60, 0.12)',
  },
  'outer': {
    title: '새외',
    subtitle: '塞外',
    desc: '중원 밖의 신비로운 세력들',
    bgColor: 'rgba(25, 30, 35, 0.95)',
    hoverBgColor: 'rgba(30, 45, 55, 0.98)',
    accentColor: 'rgba(100, 180, 200, 0.85)',
    glowColor: 'rgba(80, 150, 180, 0.3)',
    inkColor: 'rgba(70, 120, 140, 0.12)',
  },
  'hidden': {
    title: '은거기인',
    subtitle: '隱居奇人',
    desc: '속세를 떠나 숨어 지내는 절세 고수들',
    bgColor: 'rgba(30, 28, 35, 0.95)',
    hoverBgColor: 'rgba(45, 40, 55, 0.98)',
    accentColor: 'rgba(160, 130, 200, 0.85)',
    glowColor: 'rgba(140, 100, 180, 0.3)',
    inkColor: 'rgba(120, 80, 150, 0.12)',
  },
  'imperial': {
    title: '관부',
    subtitle: '官府',
    desc: '황제와 율법의 집행자',
    bgColor: 'rgba(32, 28, 25, 0.95)',
    hoverBgColor: 'rgba(50, 40, 30, 0.98)',
    accentColor: 'rgba(200, 170, 100, 0.85)',
    glowColor: 'rgba(190, 160, 120, 0.3)',
    inkColor: 'rgba(150, 120, 60, 0.12)',
  }
};

export default function MainLobby({ group, subGroup, onBack }: MainLobbyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredFaction, setHoveredFaction] = useState<Faction | null>(null);
  const { playHover, playClick } = useAudio();
  
  // 드래그 스크롤 상태
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({ startX: 0, startScrollLeft: 0 });
  const isDragClick = useRef(false); // 드래그인지 클릭인지 판별

  // 부드러운 스크롤 Refs
  const scrollTargetRef = useRef(0);
  const scrollAnimationRef = useRef<number | null>(null);

  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 드래그 시작 (마우스)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    isDragClick.current = false;
    dragInfoRef.current = {
      startX: e.pageX,
      startScrollLeft: scrollRef.current.scrollLeft
    };
    
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  };

  // 터치 시작 (모바일)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    isDragClick.current = false;
    dragInfoRef.current = {
      startX: e.touches[0].pageX,
      startScrollLeft: scrollRef.current.scrollLeft
    };
    
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  };

  // 터치 이동 (모바일)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    const xDiff = e.touches[0].pageX - dragInfoRef.current.startX;
    if (Math.abs(xDiff) > 5) {
      isDragClick.current = true;
    }

    const walk = xDiff * 1.2;
    scrollRef.current.scrollLeft = dragInfoRef.current.startScrollLeft - walk;
    scrollTargetRef.current = scrollRef.current.scrollLeft;
  };

  // 터치 종료 (모바일)
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 전역 드래그 이벤트 처리
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!scrollRef.current) return;
      
      const xDiff = e.pageX - dragInfoRef.current.startX;
      // 5px 이상 움직이면 드래그로 간주
      if (Math.abs(xDiff) > 5) {
        isDragClick.current = true;
      }

      const walk = xDiff * 1.5;
      scrollRef.current.scrollLeft = dragInfoRef.current.startScrollLeft - walk;
      scrollTargetRef.current = scrollRef.current.scrollLeft;
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // 특정 인덱스의 카드로 스크롤
  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    
    const scrollElement = scrollRef.current;
    const cards = scrollElement.querySelectorAll('[data-faction-card]');
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      const containerWidth = scrollElement.clientWidth;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      
      // 카드를 중앙에 위치시키기
      const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);
      const maxScroll = scrollElement.scrollWidth - containerWidth;
      const newTarget = Math.max(0, Math.min(maxScroll, targetScroll));
      
      // 부드러운 스크롤 애니메이션
      startSmoothScroll(newTarget);
    }
  };

  // 현재 애니메이션 진행 여부를 추적하는 플래그
  const isAnimatingRef = useRef(false);

  // 부드러운 스크롤 애니메이션 함수
  const startSmoothScroll = (target: number) => {
    if (!scrollRef.current) return;
    
    // 이미 실행 중인 애니메이션이 있으면 취소
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    
    scrollTargetRef.current = target;
    isAnimatingRef.current = true;
    
    const animate = () => {
      if (!scrollRef.current) {
        scrollAnimationRef.current = null;
        isAnimatingRef.current = false;
        return;
      }
      
      const current = scrollRef.current.scrollLeft;
      const diff = scrollTargetRef.current - current;
      
      if (Math.abs(diff) < 1) {
        scrollRef.current.scrollLeft = scrollTargetRef.current;
        scrollAnimationRef.current = null;
        isAnimatingRef.current = false;
        return;
      }
      
      scrollRef.current.scrollLeft = current + diff * 0.12;
      scrollAnimationRef.current = requestAnimationFrame(animate);
    };
    
    scrollAnimationRef.current = requestAnimationFrame(animate);
  };



  // 컴포넌트 마운트 시 애니메이션 정리
  useEffect(() => {
    // 초기 스크롤 위치 설정
    if (scrollRef.current) {
      scrollTargetRef.current = scrollRef.current.scrollLeft;
    }
    
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  // 구파일방: 소림(A)~개방(J), 오대세가: 남궁(K)~제갈(O)
  const GUPAEILBANG_CODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const ODAESEGA_CODES = ['K', 'L', 'M', 'N', 'O'];

  const filteredFactions = useMemo(() => {
    let factions = FACTIONS.filter(f => f.category === group as FactionCategory);
    
    // 정파의 경우 서브그룹으로 추가 필터링
    if (group === 'orthodox' && subGroup) {
      if (subGroup === 'gupaeilbang') {
        factions = factions.filter(f => GUPAEILBANG_CODES.includes(f.code));
      } else if (subGroup === 'odaesega') {
        factions = factions.filter(f => ODAESEGA_CODES.includes(f.code));
      }
    }
    
    return factions;
  }, [group, subGroup]);
  
  // 서브그룹이 있으면 서브그룹 테마, 없으면 그룹 테마
  const theme = GROUP_THEME[subGroup || group] || GROUP_THEME['orthodox'];

  const factionCharacters = useMemo(() => {
    if (!selectedFaction) return [];
    return getCharactersByFaction(selectedFaction.id);
  }, [selectedFaction]);

  return (
    <motion.div 
      ref={mainContainerRef}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '100dvh',
        overflow: 'hidden',
        background: '#0c0a08',
        touchAction: 'pan-y pinch-zoom' // 수직 스크롤과 줌은 허용, 가로 스와이프는 커스텀 처리
      }}
    >
      {/* 카드 호버 배경 이미지 */}
      <motion.div
        animate={{ 
          opacity: hoveredIndex !== null ? 0.6 : 0,
          background: hoveredFaction ? 
            `radial-gradient(ellipse 80% 80% at 50% 50%, ${hoveredFaction.colors?.primary || theme.accentColor}15 0%, rgba(0,0,0,0.8) 70%)` :
            'rgba(0,0,0,0.8)'
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />

      {/* 기본 배경 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 100% 100% at 50% 0%, ${theme.bgColor} 0%, rgba(12, 10, 8, 1) 70%),
          radial-gradient(ellipse 50% 50% at 20% 80%, ${theme.inkColor} 0%, transparent 50%),
          radial-gradient(ellipse 50% 50% at 80% 60%, ${theme.inkColor} 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* 종이 텍스처 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
        pointerEvents: 'none'
      }} />

      {/* 떠다니는 먹 파티클 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            opacity: [0.02, 0.06, 0.02]
          }}
          transition={{
            duration: 15 + i * 4,
            repeat: Infinity,
            delay: i * 2.5,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: `${10 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            width: `${100 + i * 30}px`,
            height: `${100 + i * 30}px`,
            background: `radial-gradient(circle, ${theme.inkColor} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* ========== 상단 헤더 - 정통 무협 스타일 (모바일 대응) ========== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(12, 10, 8, 0.95) 0%, rgba(12, 10, 8, 0.7) 70%, transparent 100%)',
        padding: isMobile ? '12px 16px' : 'clamp(20px, 3vh, 30px) clamp(30px, 5vw, 60px)'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '8px' : '24px'
        }}>
          {/* 좌측: 뒤로가기 + 타이틀 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '24px', flex: 1, minWidth: 0 }}>
            {/* 뒤로 가기 버튼 */}
            <motion.button 
              onClick={() => {
                playClick();
                onBack();
              }}
              onMouseEnter={playHover}
              whileHover={{ x: -3, borderColor: theme.accentColor }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '6px' : '10px',
                padding: isMobile ? '8px 12px' : '10px 20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(200, 190, 180, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: 'rgba(220, 210, 200, 0.7)',
                fontSize: isMobile ? '0.75rem' : '0.9rem',
                fontFamily: '"Nanum Myeongjo", serif',
                letterSpacing: '0.1em',
                flexShrink: 0
              }}
            >
              <svg style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{isMobile ? '뒤로' : '세력 선택'}</span>
            </motion.button>

            {/* 세로 구분선 - 모바일에서 숨김 */}
            {!isMobile && (
              <div style={{ 
                width: '1px', 
                height: '40px', 
                background: 'linear-gradient(180deg, transparent, rgba(200, 190, 180, 0.2), transparent)' 
              }} />
            )}

            {/* 현재 그룹 타이틀 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', minWidth: 0 }}>
              {/* 인장 */}
              <motion.div 
                animate={{ 
                  boxShadow: [`0 0 15px ${theme.glowColor}`, `0 0 25px ${theme.glowColor}`, `0 0 15px ${theme.glowColor}`]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  width: isMobile ? '36px' : '50px',
                  height: isMobile ? '36px' : '50px',
                  border: `2px solid ${theme.accentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Nanum Myeongjo", serif',
                  fontSize: isMobile ? '1rem' : '1.5rem',
                  color: theme.accentColor,
                  background: 'rgba(0,0,0,0.3)',
                  flexShrink: 0
                }}
              >
                {theme.subtitle.charAt(0)}
              </motion.div>
              <div style={{ minWidth: 0 }}>
                <h1 style={{
                  fontSize: isMobile ? '1rem' : 'clamp(1.5rem, 3vw, 2rem)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  color: 'rgba(250, 245, 240, 0.95)',
                  margin: 0,
                  textShadow: `0 0 30px ${theme.glowColor}`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {theme.title}
                </h1>
                <p style={{
                  fontSize: isMobile ? '0.65rem' : '0.8rem',
                  color: theme.accentColor,
                  letterSpacing: isMobile ? '0.15em' : '0.3em',
                  marginTop: '2px'
                }}>
                  {theme.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* 우측: 네비게이션 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.05, borderColor: theme.accentColor }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: isMobile ? '36px' : '44px',
                  height: isMobile ? '36px' : '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(200, 190, 180, 0.2)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'rgba(200, 190, 180, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* 그룹 설명 - 모바일에서 숨김 */}
        {!isMobile && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: 'center',
              color: 'rgba(200, 190, 180, 0.5)',
              fontSize: '0.9rem',
              fontFamily: '"Nanum Myeongjo", serif',
              letterSpacing: '0.15em',
              marginTop: '20px'
            }}
          >
            {theme.desc}
          </motion.p>
        )}
      </header>

      {/* ========== 메인: 가로 스크롤 문파 카드 ========== */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        paddingTop: isMobile ? 'clamp(80px, 15vh, 120px)' : 'clamp(160px, 20vh, 200px)',
        paddingBottom: isMobile ? 'clamp(80px, 12vh, 100px)' : 'clamp(120px, 18vh, 160px)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10,
        overflow: 'visible',
        pointerEvents: 'none'
      }}>
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={(e) => {
            if (selectedFaction) return;
            
            // 수직 스크롤을 가로 스크롤로 변환
            if (e.deltaY !== 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
               const container = e.currentTarget;
               // 직접 스크롤로 반응성 개선
               container.scrollLeft += e.deltaY;
               
               // 스크롤 타겟 동기화 및 애니메이션 취소
               scrollTargetRef.current = container.scrollLeft;
               if (scrollAnimationRef.current) {
                 cancelAnimationFrame(scrollAnimationRef.current);
                 scrollAnimationRef.current = null;
                 isAnimatingRef.current = false;
               }
            }
          }}
          onMouseLeave={() => {
            if (!isMobile) {
              setHoveredIndex(null);
              setHoveredFaction(null);
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            overflowX: 'auto',
            overflowY: 'clip',
            display: 'flex',
            alignItems: 'center',
            scrollSnapType: isDragging ? 'none' : 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: '8vw',
            paddingRight: '8vw',
            paddingTop: '100px',
            paddingBottom: '100px',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(40px, 5vw, 60px)', 
            height: 'auto', 
            padding: isMobile ? '40px 20px' : '80px 40px',
            alignItems: 'center',
            overflow: 'visible'
          }}>
            {filteredFactions.length > 0 ? (
              filteredFactions.map((faction, index) => (
                <motion.div
                  key={faction.id}
                  data-faction-card
                  style={{ 
                    scrollSnapAlign: 'center', 
                    flexShrink: 0,
                    zIndex: hoveredIndex === index ? 30 : 1,
                    position: 'relative'
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    filter: !isMobile && hoveredIndex !== null && hoveredIndex !== index ? 'brightness(0.4)' : 'brightness(1)',
                    scale: !isMobile && hoveredIndex !== null && hoveredIndex !== index ? 0.95 : 1
                  }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.4,
                    filter: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHoveredIndex(index);
                      setHoveredFaction(faction);
                      playHover();
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHoveredIndex(null);
                      setHoveredFaction(null);
                    }
                  }}
                  onClick={() => {
                    // 모바일에서 탭으로 선택
                    if (isMobile && !isDragClick.current) {
                      playClick();
                      setSelectedFaction(faction);
                    }
                  }}
                >
                  {/* 카드 배경 이펙트 레이어 - 데스크톱만 */}
                  {!isMobile && (
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <CardBackgroundEffect 
                          faction={faction} 
                          primaryColor={faction.colors?.primary || theme.accentColor}
                        />
                      )}
                    </AnimatePresence>
                  )}
                  <FactionCard 
                    faction={faction}
                    theme={theme}
                    isHovered={!isMobile && hoveredIndex === index}
                    isMobile={isMobile}
                    onSelect={() => {
                      if (!isDragClick.current) {
                        playClick();
                        setSelectedFaction(faction);
                      }
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '400px',
                height: '100%',
                color: 'rgba(200, 190, 180, 0.4)',
                fontFamily: '"Nanum Myeongjo", serif',
                fontSize: '1.1rem'
              }}>
                해당 세력에는 아직 문파가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 전체 화면 비주얼 이펙트 - 호버 시 활성화 (카드들 뒤에 표시) */}
      <AnimatePresence>
        {hoveredFaction && (
          <motion.div 
            style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
             <VisualEngine
               effectType={hoveredFaction.effectType}
               particleCount={100}
               color={hoveredFaction.colors?.accent || hoveredFaction.colors?.primary || theme.accentColor}
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 좌우 페이드 - 파티클 위에 표시 */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(90deg, rgba(12, 10, 8, 1) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 20
      }} />
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(-90deg, rgba(12, 10, 8, 1) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 20
      }} />

      {/* ========== 하단 네비게이션 ========== */}
      <div style={{
        position: 'fixed',
        bottom: 'clamp(20px, 4vh, 40px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50
      }}>
        {/* 스크롤 힌트 */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '16px'
          }}
        >
          <span style={{ color: 'rgba(200, 190, 180, 0.3)', fontSize: '12px' }}>?</span>
          <span style={{ 
            color: 'rgba(200, 190, 180, 0.4)', 
            fontSize: '0.75rem',
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.1em'
          }}>
            드래그 또는 마우스 휠로 문파 탐색
          </span>
          <span style={{ color: 'rgba(200, 190, 180, 0.3)', fontSize: '12px' }}></span>
        </motion.div>

        {/* 문파 인디케이터 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(200, 190, 180, 0.1)',
          backdropFilter: 'blur(8px)'
        }}>
          {filteredFactions.map((faction, i) => {
            const factionColor = faction.colors?.primary || theme.accentColor;
            const isActive = hoveredIndex === i;
            
            return (
              <motion.button
                key={faction.id}
                onClick={() => {
                  playClick();
                  scrollToIndex(i);
                }}
                onMouseEnter={playHover}
                whileHover={{ 
                  scale: 1.4,
                  boxShadow: `0 0 12px ${factionColor}`
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  width: isActive ? 28 : 10,
                  height: isActive ? 10 : 10,
                  background: isActive ? factionColor : 'rgba(200, 190, 180, 0.3)',
                  boxShadow: isActive ? `0 0 15px ${factionColor}` : 'none'
                }}
                transition={{ duration: 0.3 }}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
                title={faction.name}
              />
            );
          })}
        </div>
      </div>

      {/* ========== 문파 상세 모달 ========== */}
      <AnimatePresence>
        {selectedFaction && (
          <FactionDetailModal 
            faction={selectedFaction}
            characters={factionCharacters}
            theme={theme}
            onClose={() => setSelectedFaction(null)}
            isMobile={isMobile}
            playHover={playHover}
            playClick={playClick}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// 문파 카드 컴포넌트 - 정통 무협 종이 스타일 + 문파별 고유 색상
// ============================================================
const FactionCard = memo(function FactionCard({ 
  faction, 
  theme,
  isHovered,
  isMobile = false,
  onSelect 
}: { 
  faction: Faction; 
  theme: typeof GROUP_THEME[string];
  isHovered: boolean;
  isMobile?: boolean;
  onSelect: () => void;
}) {
  // 문파 고유 색상 사용
  const factionColors = faction.colors || { primary: theme.accentColor, secondary: theme.bgColor, accent: theme.glowColor };
  const primaryColor = factionColors.primary;
  const secondaryColor = factionColors.secondary;
  const accentColor = factionColors.accent;
  
  // 색상에서 RGBA 생성
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // 색상 밝기 계산 (0-255)
  const getLuminance = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // 어두운 색상인지 판단 (밝기 < 150)
  const isDarkAccent = getLuminance(accentColor) < 150;
  const isDarkPrimary = getLuminance(primaryColor) < 80;
  
  const glowColor = hexToRgba(primaryColor, 0.5);
  const inkColor = hexToRgba(primaryColor, 0.2);
  const bgGradient = isHovered 
    ? `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.2)} 0%, rgba(15, 13, 10, 0.98) 50%, ${hexToRgba(secondaryColor, 0.15)} 100%)`
    : 'rgba(25, 23, 20, 0.95)';

  return (
    <motion.div 
      animate={{ 
        y: isHovered && !isMobile ? -30 : 0,
        scale: isHovered && !isMobile ? 1.08 : 1,
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onClick={onSelect}
      style={{
        position: 'relative',
        minWidth: isMobile ? 'clamp(260px, 70vw, 320px)' : 'clamp(320px, 25vw, 420px)',
        width: isMobile ? 'clamp(260px, 70vw, 320px)' : 'clamp(320px, 25vw, 420px)',
        height: isMobile ? 'clamp(350px, 55vh, 450px)' : 'clamp(450px, 65vh, 600px)',
        overflow: 'visible',
        cursor: 'pointer',
        willChange: 'transform',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 내부 글로우 효과 - 오버레이 */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: '-20px',
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
      
      {/* 메인 카드 컨테이너 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: bgGradient,
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
        boxShadow: isHovered 
          ? `0 25px 60px -15px rgba(0,0,0,0.5), 0 0 40px ${glowColor}`
          : '0 10px 30px -10px rgba(0,0,0,0.3)'
      }}>
      
      {/* 문파별 배경 이미지 */}
      <motion.div
        animate={{ opacity: isHovered ? 0.35 : 0.12, scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://1-r-q.uk/images/bg/${faction.code}.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(30%)',
          pointerEvents: 'none'
        }}
      />
      {/* 배경 이미지 위 어두운 오버레이 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isHovered 
          ? `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.85) 100%)`
          : `linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.92) 100%)`,
        transition: 'background 0.4s ease',
        pointerEvents: 'none'
      }} />

      {/* 노이즈 텍스처 패턴 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: isHovered ? 0.1 : 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        transition: 'opacity 0.4s ease'
      }} />

      {/* 배경 한자 워터마크 */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.15 : 0.04, scale: isHovered ? 1.15 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <span style={{
          fontSize: 'clamp(200px, 25vw, 300px)',
          fontFamily: '"Nanum Myeongjo", serif',
          color: isHovered ? hexToRgba(primaryColor, 0.35) : 'rgba(200, 190, 180, 0.5)',
          userSelect: 'none',
          transition: 'color 0.5s ease'
        }}>
          {faction.hanja?.charAt(0) || '無'}
        </span>
      </motion.div>

      {/* 먹물 번짐 효과 - 문파 고유 색상 */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 120% 80% at 50% 90%, ${inkColor} 0%, transparent 60%)`,
          pointerEvents: 'none'
        }} 
      />

      {/* 상단 빛 번짐 - 문파 고유 색상 */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.25 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '50%',
          background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${glowColor} 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} 
      />

      {/* 테두리 프레임 - 문파 고유 색상 */}
      <div style={{
        position: 'absolute',
        inset: '8px',
        border: `1px solid ${isHovered ? accentColor : 'rgba(200, 190, 180, 0.15)'}`,
        transition: 'border-color 0.5s ease',
        pointerEvents: 'none'
      }} />

      {/* 코너 장식 - 문파 고유 색상 */}
      {[
        { top: 0, left: 0, borderWidth: '3px 0 0 3px' },
        { top: 0, right: 0, borderWidth: '3px 3px 0 0' },
        { bottom: 0, left: 0, borderWidth: '0 0 3px 3px' },
        { bottom: 0, right: 0, borderWidth: '0 3px 3px 0' }
      ].map((pos, i) => (
        <motion.div
          key={i}
          animate={{ opacity: isHovered ? 0.9 : 0.3 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            ...pos,
            width: '20px',
            height: '20px',
            borderStyle: 'solid',
            borderColor: isHovered ? primaryColor : 'rgba(200, 190, 180, 0.4)',
            borderWidth: pos.borderWidth,
            pointerEvents: 'none',
            transition: 'border-color 0.5s ease'
          }}
        />
      ))}

      {/* 상단 악센트 라인 - 문파 고유 색상 */}
      <motion.div 
        animate={{ 
          opacity: isHovered ? 1 : 0.3,
          boxShadow: isHovered ? `0 0 25px ${glowColor}` : 'none'
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
          zIndex: 10
        }}
      />

      {/* 컨텐츠 영역 */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(24px, 3vw, 36px)'
      }}>
        
        {/* 상단: 문파 코드 + 인장 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '0.7rem',
            color: isHovered 
              ? (isDarkPrimary ? hexToRgba(accentColor, 0.6) : hexToRgba(primaryColor, 0.6)) 
              : 'rgba(200, 190, 180, 0.3)',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            transition: 'color 0.5s ease'
          }}>
            {faction.code}
          </span>
          <motion.div 
            animate={{ 
              boxShadow: isHovered 
                ? (isDarkPrimary 
                    ? [`0 0 15px ${hexToRgba(accentColor, 0.5)}`, `0 0 30px ${hexToRgba(accentColor, 0.5)}`, `0 0 15px ${hexToRgba(accentColor, 0.5)}`]
                    : [`0 0 15px ${glowColor}`, `0 0 30px ${glowColor}`, `0 0 15px ${glowColor}`])
                : 'none'
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '48px',
              height: '48px',
              border: `2px solid ${isHovered ? (isDarkPrimary ? accentColor : primaryColor) : 'rgba(200, 190, 180, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Nanum Myeongjo", serif',
              fontSize: '1.3rem',
              color: isHovered ? (isDarkPrimary ? accentColor : primaryColor) : 'rgba(200, 190, 180, 0.6)',
              background: isHovered ? (isDarkPrimary ? hexToRgba(accentColor, 0.1) : hexToRgba(primaryColor, 0.1)) : 'transparent',
              transition: 'all 0.5s ease'
            }}
          >
            {faction.hanja?.charAt(0) || '無'}
          </motion.div>
        </div>


        {/* 중앙: 문파 정보 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.h2 
            animate={{ 
              textShadow: isHovered 
                ? (isDarkPrimary 
                    ? `0 0 40px ${accentColor}, 0 0 60px ${accentColor}` 
                    : `0 0 40px ${glowColor}`)
                : 'none',
              color: isHovered 
                ? (isDarkPrimary ? accentColor : primaryColor) 
                : 'rgba(250, 245, 240, 0.95)'
            }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontFamily: '"Nanum Myeongjo", serif',
              marginBottom: '12px',
              fontWeight: 600
            }}
          >
            {faction.name.split('(')[0].trim()}
          </motion.h2>
          
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: isHovered ? accentColor : (isDarkPrimary ? 'rgba(200, 190, 180, 0.7)' : hexToRgba(primaryColor, 0.7)),
            letterSpacing: '0.3em',
            marginBottom: '20px',
            fontFamily: '"Nanum Myeongjo", serif',
            transition: 'color 0.5s ease'
          }}>
            {faction.hanja}
          </p>
          
          <p style={{
            color: 'rgba(220, 215, 210, 0.7)',
            fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
            lineHeight: 1.7,
            maxWidth: '90%',
            fontFamily: '"Nanum Myeongjo", serif'
          }}>
            {faction.desc}
          </p>
        </div>

        {/* 하단: 무공 태그 + 버튼 */}
        <div style={{ marginTop: 'auto' }}>
          {/* 하단 그라데이션 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            pointerEvents: 'none'
          }} />
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* 대표 무공 */}
            {faction.signature_skills && faction.signature_skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {faction.signature_skills.slice(0, 3).map((skill, i) => (
                  <span 
                    key={i} 
                    style={{
                      fontSize: '0.8rem',
                      padding: '6px 14px',
                      background: isDarkAccent 
                        ? (isHovered ? hexToRgba(accentColor, 0.35) : hexToRgba(accentColor, 0.2))
                        : (isHovered ? hexToRgba(accentColor, 0.15) : hexToRgba(accentColor, 0.08)),
                      border: `1px solid ${isHovered ? hexToRgba(accentColor, 0.8) : hexToRgba(accentColor, 0.4)}`,
                      borderRadius: '4px',
                      color: isDarkAccent 
                        ? (isHovered ? '#f5f5f0' : 'rgba(245, 240, 230, 0.85)')
                        : (isHovered ? accentColor : hexToRgba(accentColor, 0.85)),
                      fontFamily: '"Nanum Myeongjo", serif',
                      transition: 'all 0.4s ease',
                      textShadow: isDarkAccent
                        ? `0 1px 2px rgba(0,0,0,0.8), 0 0 12px ${hexToRgba(accentColor, 0.6)}`
                        : (isHovered ? `0 0 8px ${hexToRgba(accentColor, 0.4)}` : 'none'),
                      boxShadow: isHovered ? `0 0 12px ${hexToRgba(accentColor, 0.3)}, inset 0 0 8px ${hexToRgba(accentColor, 0.15)}` : 'none'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* 상세보기 영역 */}
            <motion.div 
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(200, 190, 180, 0.1)'
              }}
            >
              <span style={{ 
                color: 'rgba(200, 190, 180, 0.5)', 
                fontSize: '0.85rem',
                fontFamily: '"Nanum Myeongjo", serif'
              }}>
                상세 정보 보기
              </span>
              <motion.div
                animate={{ x: isHovered ? 8 : 0 }}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${isHovered ? theme.accentColor : 'rgba(200, 190, 180, 0.2)'}`,
                  color: isHovered ? theme.accentColor : 'rgba(200, 190, 180, 0.5)',
                  transition: 'all 0.4s ease'
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 호버 글로우 - 카드 테두리 */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset 0 0 60px ${glowColor}`,
          border: `2px solid ${hexToRgba(primaryColor, isHovered ? 0.6 : 0)}`,
          pointerEvents: 'none',
          transition: 'border 0.4s ease'
        }}
      />
      </div>
    </motion.div>
  );
});

// ============================================================
// 문파 상세 모달 - 정통 무협 스타일 리뉴얼
// ============================================================
function FactionDetailModal({ 
  faction, 
  characters,
  theme,
  onClose,
  isMobile = false,
  playHover,
  playClick
}: { 
  faction: Faction; 
  characters: ReturnType<typeof getCharactersByFaction>;
  theme: typeof GROUP_THEME[string];
  onClose: () => void;
  isMobile?: boolean;
  playHover: () => void;
  playClick: () => void;
}) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // 문파 고유 색상 사용
  const factionColors = faction.colors || { primary: theme.accentColor, secondary: theme.bgColor, accent: theme.glowColor };
  const factionAccent = factionColors.accent;

  // 색상 밝기 계산
  const getLuminance = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
  const isDarkAccent = getLuminance(factionAccent) < 150;

  // 모달이 열릴 때 스크롤 상단으로 이동
  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '10px' : 'clamp(20px, 5vh, 40px)'
      }}
    >
      {/* 백드롭 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)'
        }}
      />
      
      {/* 모달 컨텐츠 */}
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isMobile ? '100%' : '1000px',
          height: '100%',
          maxHeight: isMobile ? '95vh' : '90vh',
          background: `linear-gradient(145deg, ${theme.bgColor} 0%, rgba(10, 8, 6, 0.98) 100%)`,
          border: `1px solid ${theme.accentColor}40`,
          borderRadius: isMobile ? '8px' : '4px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px ${theme.glowColor}`
        }}
      >
        {/* 문파별 배경 이미지 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://1-r-q.uk/images/bg/${faction.code}.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.12,
          filter: 'grayscale(30%)',
          pointerEvents: 'none'
        }} />
        {/* 배경 이미지 위 그라데이션 오버레이 - 더 투명하게 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.3) 50%, rgba(10,8,6,0.5) 100%)`,
          pointerEvents: 'none'
        }} />

        {/* 닫기 버튼 */}
        <button 
          onClick={() => {
            playClick();
            onClose();
          }}
          onMouseEnter={playHover}
          style={{
            position: 'absolute',
            top: isMobile ? '12px' : '20px',
            right: isMobile ? '12px' : '20px',
            zIndex: 50,
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${theme.accentColor}30`,
            color: theme.accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <svg style={{ width: isMobile ? '18px' : '20px', height: isMobile ? '18px' : '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 스크롤 가능한 전체 영역 */}
        <div 
          ref={modalContentRef}
          className="custom-scrollbar"
          data-lenis-prevent
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {/* 상단 헤더 영역 */}
          <div style={{
            position: 'relative',
            padding: isMobile ? '20px 16px 16px' : '40px 40px 30px',
            borderBottom: `1px solid ${theme.accentColor}20`,
            background: `linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)`
          }}>
             {/* 거대 배경 한자 */}
             <div style={{
              position: 'absolute',
              top: '-20px',
              right: '10px',
              fontSize: isMobile ? '8rem' : '12rem',
              fontFamily: '"Nanum Myeongjo", serif',
              color: theme.accentColor,
              opacity: 0.05,
              pointerEvents: 'none',
              userSelect: 'none'
          }}>
            {faction.hanja?.charAt(0)}
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
             <h2 style={{
              fontSize: isMobile ? 'clamp(1.5rem, 8vw, 2rem)' : 'clamp(2.5rem, 5vw, 3.5rem)',
              fontFamily: '"Nanum Myeongjo", serif',
              color: '#f0f0f0',
              marginBottom: '8px',
              textShadow: `0 0 20px ${theme.glowColor}`
            }}>
              {faction.name.split('(')[0].trim()}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px', flexWrap: 'wrap' }}>
              <span style={{
                color: theme.accentColor,
                fontFamily: '"Nanum Myeongjo", serif',
                fontSize: isMobile ? '1.1rem' : '1.5rem',
                letterSpacing: '0.2em'
              }}>
                {faction.hanja}
              </span>
              <div style={{ width: '40px', height: '1px', background: theme.accentColor, opacity: 0.5 }} />
              <span style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: isMobile ? '0.75rem' : '0.9rem',
                letterSpacing: '0.05em'
              }}>
                {faction.code}
              </span>
            </div>
          </motion.div>
          </div>

          {/* 본문 영역 */}
          <div style={{ padding: isMobile ? '20px 16px' : '40px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* 1. 소개 섹션 */}
              <section style={{ marginBottom: isMobile ? '40px' : '60px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <SectionTitle title="문파 소개" theme={theme} />
                  <p style={{
                    fontSize: isMobile ? '0.95rem' : '1.1rem',
                    lineHeight: '1.8',
                  color: 'rgba(230,230,230,0.85)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  marginBottom: '20px'
                }}>
                  {faction.desc}
                </p>
                {faction.philosophy && (
                  <div style={{
                    position: 'relative',
                    padding: isMobile ? '16px 20px' : '24px 30px',
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: `3px solid ${theme.accentColor}`,
                    marginTop: isMobile ? '20px' : '30px'
                  }}>
                    <p style={{
                      fontSize: isMobile ? '0.95rem' : '1.1rem',
                      fontStyle: 'italic',
                      color: theme.accentColor,
                      fontFamily: '"Nanum Myeongjo", serif',
                      textAlign: 'center'
                    }}>
                      "{faction.philosophy}"
                    </p>
                  </div>
                )}
              </motion.div>
            </section>

            {/* 2. 대표 무공 섹션 */}
            {faction.signature_skills && faction.signature_skills.length > 0 && (
              <section style={{ marginBottom: '60px' }}>
                 <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <SectionTitle title="대표 무공" theme={theme} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {faction.signature_skills.map((skill, i) => (
                      <div 
                        key={i} 
                        style={{
                          padding: '12px 20px',
                          background: 'rgba(0, 0, 0, 0.5)',
                          border: `1px solid ${factionAccent}50`,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.3s',
                          boxShadow: `0 0 15px rgba(0,0,0,0.3), inset 0 0 10px ${factionAccent}10`,
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                         <div style={{ 
                           width: '6px', 
                           height: '6px', 
                           background: factionAccent, 
                           transform: 'rotate(45deg)', 
                           boxShadow: `0 0 8px ${factionAccent}` 
                         }} />
                         <span style={{
                           color: 'rgba(255, 255, 255, 0.95)',
                           fontFamily: '"Nanum Myeongjo", serif',
                           fontSize: '1rem',
                           textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                           fontWeight: 500
                         }}>
                           {skill}
                         </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>
            )}

            {/* 3. 주요 인물 섹션 */}
            {characters.length > 0 && (
              <section style={{ marginBottom: isMobile ? '40px' : '60px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <SectionTitle title="주요 인물" theme={theme} />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: isMobile ? '12px' : '20px'
                  }}>
                    {characters.map((char) => (
                       <div 
                        key={char.id}
                        style={{
                          padding: isMobile ? '16px' : '24px',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: `1px solid ${theme.accentColor}30`,
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              fontFamily: '"Nanum Myeongjo", serif',
                              color: 'rgba(255,255,255,0.95)',
                              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                            }}>
                              {char.name}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '4px 10px',
                              background: char.realm === '화경' || char.realm === '현경' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(255,255,255,0.15)',
                              border: `1px solid ${char.realm === '화경' || char.realm === '현경' ? 'rgba(249, 115, 22, 0.6)' : 'rgba(255,255,255,0.3)'}`,
                              color: char.realm === '화경' || char.realm === '현경' ? '#f97316' : 'rgba(255,255,255,0.9)',
                              borderRadius: '100px',
                              fontWeight: 500,
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}>
                              {char.realm}
                            </span>
                         </div>
                         <div style={{ fontSize: '0.9rem', color: theme.accentColor, marginBottom: '6px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                           {char.title}
                         </div>
                         <div style={{ fontSize: '0.85rem', color: 'rgba(200,200,200,0.85)', textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>
                           {char.position}
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>
            )}

            {/* 4. 세력 관계 섹션 */}
            {faction.relations && faction.relations.length > 0 && (
               <section style={{ marginBottom: '40px' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <SectionTitle title="세력 관계" theme={theme} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                       {faction.relations.map((rel, i) => {
                         const targetFaction = FACTIONS.find(f => f.id === rel.targetId);
                         const targetName = targetFaction 
                            ? targetFaction.name.split('(')[0].trim() 
                            : rel.targetId;
                            
                         return (
                         <div key={i} style={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: '20px', 
                           padding: '16px',
                           background: 'rgba(255,255,255,0.02)',
                           borderLeft: `2px solid ${
                             rel.type === '동맹' ? '#64b5f6' : 
                             rel.type === '적대' ? '#e57373' : '#a0a0a0'
                           }`
                         }}>
                            <span style={{
                              fontWeight: 600,
                              color: rel.type === '동맹' ? '#90caf9' : 
                                     rel.type === '적대' ? '#ef9a9a' : '#bdbdbd',
                              minWidth: '40px'
                            }}>
                              {rel.type}
                            </span>
                            <span style={{ color: 'rgba(230,230,230,0.9)', minWidth: '80px', fontWeight: 500 }}>
                              {targetName}
                            </span>
                            <span style={{ color: 'rgba(180,180,180,0.7)', fontSize: '0.95rem' }}>
                              {rel.description}
                            </span>
                         </div>
                       )})}
                    </div>
                  </motion.div>
               </section>
            )}
             
            {/* 5. 역사 - 있으면 표시 */}
            {faction.history && (
               <section style={{ marginBottom: '60px' }}>
                  <SectionTitle title="역사" theme={theme} />
                  <div style={{ color: 'rgba(200,200,200,0.8)', lineHeight: 1.6 }}>
                     <p style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{faction.history}</p>
                  </div>
               </section>
            )}

            {/* 상세 페이지 이동 버튼 */}
            <div style={{
              marginTop: '40px',
              paddingTop: '30px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Link href={`/factions/${faction.id}`} style={{ width: '100%', maxWidth: '400px' }}>
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    borderColor: theme.accentColor,
                    background: `linear-gradient(90deg, transparent, ${theme.accentColor}10, transparent)`,
                    boxShadow: `0 0 30px ${theme.glowColor}`
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '18px',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${theme.accentColor}40`,
                    color: theme.accentColor,
                    fontSize: '1.1rem',
                    fontFamily: '"Nanum Myeongjo", serif',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 10 }}>
                    {faction.name.split('(')[0].trim()} 입장하기
                  </span>
                </motion.button>
              </Link>
            </div>

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 섹션 타이틀 컴포넌트
function SectionTitle({ title, theme }: { title: string, theme: any }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
      paddingBottom: '10px',
      background: 'rgba(0,0,0,0.3)',
      padding: '12px 16px',
      borderRadius: '4px'
    }}>
      <div style={{ width: '4px', height: '24px', background: theme.accentColor, boxShadow: `0 0 10px ${theme.accentColor}` }} />
      <h3 style={{
        fontSize: '1.3rem',
        fontFamily: '"Nanum Myeongjo", serif',
        color: 'rgba(255,255,255,0.98)',
        margin: 0,
        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
      }}>
        {title}
      </h3>
    </div>
  );
}// ============================================================
// 카드 뒷 배경 이펙트 컴포넌트 (호버 시 카드 바로 뒤에 표시)
// ============================================================
const CardBackgroundEffect = memo(function CardBackgroundEffect({ faction, primaryColor }: { faction: Faction; primaryColor: string }) {
  const effectType = faction.effectType || '수묵';
  const particleCount = 15; // 성능 최적화를 위해 파티클 수 감소
  
  // 색상에서 RGBA 생성
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // 파티클 생성 - 카드 주위로
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 140 - 20, // 카드 좌우로 약간 벗어남
      y: Math.random() * 140 - 20,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 1,
      duration: Math.random() * 2 + 1.5
    }));
  }, []);

  const renderParticle = (particle: typeof particles[0]) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      pointerEvents: 'none'
    };

    switch (effectType) {
      case '금광':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5], y: [0, -30, -60] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size, height: particle.size, borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size}px ${primaryColor}` }}
          />
        );
      case '수묵':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.8, 0.5], rotate: [0, 180, 360] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration + 1, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size * 2, height: particle.size * 2, borderRadius: '50%',
              background: `radial-gradient(circle, ${hexToRgba(primaryColor, 0.5)} 0%, transparent 70%)`,
              filter: 'blur(2px)' }}
          />
        );
      case '꽃잎':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 0.9, 0], y: [-20, 150], x: [0, Math.sin(particle.id) * 40], rotate: [0, 360] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration + 2, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size, height: particle.size * 1.3, borderRadius: '50% 0 50% 50%',
              background: primaryColor, transform: 'rotate(45deg)' }}
          />
        );
      case '번개':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, repeat: Infinity, delay: particle.delay * 2, repeatDelay: particle.duration }}
            style={{ ...baseStyle, width: 2, height: particle.size * 5, background: `linear-gradient(180deg, ${primaryColor}, transparent)`,
              boxShadow: `0 0 8px ${primaryColor}`, transform: `rotate(${Math.random() * 30 - 15}deg)` }}
          />
        );
      case '화염':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: [0, 0.8, 0], y: [60, -60], scale: [0.5, 1.2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size, height: particle.size * 1.5,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `linear-gradient(0deg, ${primaryColor}, #ff6b35, #ffcc00)`,
              boxShadow: `0 0 ${particle.size}px ${primaryColor}` }}
          />
        );
      case '빙설':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 0.8, 0], y: [-20, 150], x: [0, Math.sin(particle.id) * 25] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration + 2, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size * 0.8, height: particle.size * 0.8, borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)', boxShadow: `0 0 ${particle.size}px rgba(200, 230, 255, 0.8)` }}
          />
        );
      case '독기':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0.5, 2.5, 0.5], x: [0, Math.sin(particle.id * 0.3) * 30, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration + 1.5, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size * 3, height: particle.size * 3, borderRadius: '50%',
              background: `radial-gradient(circle, ${hexToRgba(primaryColor, 0.5)} 0%, transparent 70%)`, filter: 'blur(3px)' }}
          />
        );
      case '혈기':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.5, 0.5], y: [0, -40, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size * 2, height: particle.size * 2, borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size}px ${primaryColor}` }}
          />
        );
      case '암영':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0], scale: [1, 1.3, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration + 1, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size * 3, height: particle.size * 3, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 0, 0, 0.7) 0%, transparent 70%)', filter: 'blur(4px)' }}
          />
        );
      case '성진':
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size, height: particle.size, background: primaryColor,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              boxShadow: `0 0 ${particle.size}px ${primaryColor}` }}
          />
        );
      case '야수기':
        // 맹수 발톱 자국 - 3개의 평행한 긁힌 자국
        const scratchSet = Math.floor(particle.id / 3);
        const scratchIndex = particle.id % 3; // 0, 1, 2 (3개의 발톱)
        
        // 화면 전체에 분포 (-10% ~ 110% 범위)
        const baseX = ((scratchSet * 47) % 120) - 10;
        const baseY = ((scratchSet * 31) % 120) - 10;
        
        // 불규칙한 대각선 방향
        const directions = [45, -45, 135, -135];
        const directionIndex = scratchSet % 4;
        const scratchAngle = directions[directionIndex] + ((scratchSet * 7) % 16 - 8);
        
        // 발톱 간격 (진행 방향에 수직으로 12px 간격)
        const angleRad = (scratchAngle * Math.PI) / 180;
        const spacing = 12;
        const offsetX = -Math.sin(angleRad) * spacing * (scratchIndex - 1);
        const offsetY = Math.cos(angleRad) * spacing * (scratchIndex - 1);
        
        // 중앙(1) 먼저, 양쪽(0, 2) 나중에
        const clawDelay = scratchIndex === 1 ? 0 : 0.06;
        
        // 5번째 파티클은 눈빛
        if (particle.id % 5 === 0) {
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.5]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity, 
                delay: particle.delay * 2,
                repeatDelay: 2.5
              }}
              style={{ 
                ...baseStyle,
                left: `${((particle.id * 23) % 100)}%`,
                top: `${((particle.id * 17) % 80) + 10}%`,
                width: '16px',
                height: '8px',
                borderRadius: '50%',
                background: `radial-gradient(ellipse, #ffcc00 0%, #ff6600 60%, transparent 100%)`,
                boxShadow: `0 0 15px #ffcc00, 0 0 30px #ff6600`,
              }}
            />
          );
        }
        
        return (
          <motion.div
            key={particle.id}
            style={{ 
              position: 'absolute',
              left: `${baseX}%`,
              top: `${baseY}%`,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${scratchAngle}deg)`,
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            {/* 발톱 자국 - 양쪽 뾰족, 중간 25% 두꺼운 형태 */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: [0, 1, 1, 1],
                opacity: [0, 1, 0.8, 0]
              }}
              transition={{ 
                duration: 0.25,
                repeat: Infinity, 
                delay: scratchSet * 1.2 + clawDelay,
                repeatDelay: 2,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.15, 0.5, 1]
              }}
              style={{
                width: '85px',
                height: '7px',
                background: `linear-gradient(90deg, 
                  transparent 0%,
                  ${primaryColor}88 8%,
                  ${primaryColor} 20%, 
                  #ff6b35 35%,
                  #ffaa00 50%,
                  #ff6b35 65%,
                  ${primaryColor} 80%,
                  ${primaryColor}88 92%,
                  transparent 100%)`,
                transformOrigin: 'left center',
                boxShadow: `
                  0 0 8px ${primaryColor},
                  0 0 16px #ff6b35aa
                `,
                clipPath: 'polygon(0% 50%, 12% 15%, 37% 0%, 50% 0%, 63% 0%, 88% 15%, 100% 50%, 88% 85%, 63% 100%, 50% 100%, 37% 100%, 12% 85%)'
              }}
            />
          </motion.div>
        );
      case '황권':
        // 관부 - 황실의 권위, 금의위/동창 스타일
        // 금빛 용린(龍鱗), 황제의 옥새, 금의위 표식
        const imperialType = particle.id % 4; // 0: 용린, 1: 옥새빛, 2: 금의위 표식, 3: 황금 기운
        
        // 용린 (龍鱗) - 용의 비늘이 반짝이는 효과
        if (imperialType === 0) {
          const scaleX = particle.x * 0.8 + 10;
          const scaleY = particle.y * 0.7 + 15;
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
              animate={{ 
                opacity: [0, 0.9, 0.8, 0],
                scale: [0.3, 1, 1.1, 0.8],
                rotateY: [-90, 0, 10, 0]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity, 
                delay: particle.delay * 1.5,
                repeatDelay: 2 + particle.duration,
                ease: "easeOut"
              }}
              style={{ 
                ...baseStyle,
                left: `${scaleX}%`,
                top: `${scaleY}%`,
                width: '18px',
                height: '24px',
                background: `linear-gradient(160deg, 
                  #ffd700 0%, 
                  #ffec8b 25%, 
                  #daa520 50%, 
                  #b8860b 75%, 
                  #ffd700 100%)`,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                boxShadow: '0 0 15px #ffd700, 0 0 30px #daa520aa, inset 0 2px 4px rgba(255,255,255,0.5)',
                transformStyle: 'preserve-3d'
              }}
            />
          );
        }
        
        // 옥새빛 - 붉은 도장처럼 찍히는 황제의 인장
        if (imperialType === 1) {
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 2 }}
              animate={{ 
                opacity: [0, 0.1, 0.9, 0.7, 0],
                scale: [2, 1.2, 1, 1, 0.9]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity, 
                delay: particle.delay * 2,
                repeatDelay: 3,
                times: [0, 0.1, 0.2, 0.7, 1],
                ease: "easeOut"
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.7 + 15}%`,
                top: `${particle.y * 0.6 + 20}%`,
                width: '35px',
                height: '35px',
                border: '3px solid #c41e3a',
                borderRadius: '4px',
                background: 'transparent',
                boxShadow: '0 0 20px #c41e3aaa, inset 0 0 15px #c41e3a44',
              }}
            >
              {/* 도장 안의 글자 형상 */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '4px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2px'
                }}
              >
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    background: '#c41e3a',
                    borderRadius: '1px'
                  }} />
                ))}
              </motion.div>
            </motion.div>
          );
        }
        
        // 금의위 표식 - 금빛 번개/검광
        if (imperialType === 2) {
          const strikeAngle = ((particle.id * 37) % 60) - 30;
          return (
            <motion.div
              key={particle.id}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 1, 0],
                opacity: [0, 1, 0.8, 0]
              }}
              transition={{ 
                duration: 0.2,
                repeat: Infinity, 
                delay: particle.delay * 1.5,
                repeatDelay: 2.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.8 + 10}%`,
                top: `${particle.y * 0.5}%`,
                width: '4px',
                height: '80px',
                background: `linear-gradient(180deg, 
                  transparent 0%,
                  #ffd700 10%,
                  #fff8dc 30%,
                  #ffd700 50%,
                  #fff8dc 70%,
                  #ffd700 90%,
                  transparent 100%)`,
                borderRadius: '2px',
                transform: `rotate(${strikeAngle}deg)`,
                transformOrigin: 'top center',
                boxShadow: '0 0 10px #ffd700, 0 0 20px #ffd70088, 0 0 40px #daa52044'
              }}
            />
          );
        }
        
        // 황금 기운 - 용틀임하는 금빛 기운
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.6, 0.5, 0],
              scale: [0.5, 1.5, 2, 2.5],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity, 
              delay: particle.delay,
              repeatDelay: 1
            }}
            style={{ 
              ...baseStyle,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: '25px',
              height: '25px',
              background: `conic-gradient(from ${particle.id * 45}deg, 
                transparent 0deg,
                #ffd700 30deg,
                #ffec8b 60deg,
                transparent 90deg,
                transparent 180deg,
                #daa520 210deg,
                #ffd700 240deg,
                transparent 270deg)`,
              borderRadius: '50%',
              filter: 'blur(2px)',
              boxShadow: '0 0 15px #ffd70066'
            }}
          />
        );
      
      case '물결': // 수로채 - 물이 퍼지는 파동
        const waveType = particle.id % 3;
        if (waveType === 0) {
          // 중심에서 퍼지는 원형 파동
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.7, 0.5, 0],
                scale: [0, 1, 2, 3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity, 
                delay: particle.delay * 2,
                ease: "easeOut"
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.6 + 20}%`,
                top: `${particle.y * 0.6 + 20}%`,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `2px solid ${hexToRgba(primaryColor, 0.6)}`,
                background: 'transparent',
                boxShadow: `0 0 10px ${hexToRgba(primaryColor, 0.3)}`
              }}
            />
          );
        } else if (waveType === 1) {
          // 물방울 튀는 효과
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0.8, 0],
                y: [0, -30, -20, 0],
                scale: [0, 1.2, 0.8, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity, 
                delay: particle.delay * 1.5,
                repeatDelay: 1.5
              }}
              style={{ 
                ...baseStyle,
                width: particle.size,
                height: particle.size * 1.3,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: `linear-gradient(180deg, rgba(255,255,255,0.9), ${primaryColor})`,
                boxShadow: `0 0 8px ${primaryColor}`
              }}
            />
          );
        } else {
          // 수면 반짝임
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0.3, 0.9, 0],
                scale: [0.8, 1.2, 1, 1.1, 0.8]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity, 
                delay: particle.delay,
                ease: "easeInOut"
              }}
              style={{ 
                ...baseStyle,
                width: particle.size * 2,
                height: particle.size * 0.8,
                borderRadius: '50%',
                background: `radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, ${hexToRgba(primaryColor, 0.5)} 50%, transparent 100%)`,
                filter: 'blur(1px)'
              }}
            />
          );
        }
      
      case '제왕검기': // 남궁세가 - 상단에서 하단으로 내려치는 제왕의 검
        const swordType = particle.id % 4;
        if (swordType === 0) {
          // 수직 하강 검기
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: -80, scaleY: 0.3 }}
              animate={{ 
                opacity: [0, 1, 0.9, 0],
                y: [-80, 0, 40, 80],
                scaleY: [0.3, 1.2, 1, 0.5]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity, 
                delay: particle.delay * 1.5,
                repeatDelay: 2,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.8 + 10}%`,
                top: '20%',
                width: '3px',
                height: '100px',
                background: `linear-gradient(180deg, ${primaryColor}, rgba(255,255,255,0.9), ${primaryColor})`,
                boxShadow: `0 0 15px ${primaryColor}, 0 0 30px ${hexToRgba(primaryColor, 0.5)}`,
                borderRadius: '2px'
              }}
            />
          );
        } else if (swordType === 1) {
          // 대각선 검격
          const angle = particle.id % 2 === 0 ? 25 : -25;
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: [0, 1, 0.8, 0],
                scaleX: [0, 1, 1, 0]
              }}
              transition={{ 
                duration: 0.3,
                repeat: Infinity, 
                delay: particle.delay * 2,
                repeatDelay: 2.5,
                ease: "easeOut"
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.6 + 20}%`,
                top: `${particle.y * 0.5 + 25}%`,
                width: '120px',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${primaryColor}, rgba(255,255,255,0.9), ${primaryColor}, transparent)`,
                boxShadow: `0 0 10px ${primaryColor}`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center'
              }}
            />
          );
        } else if (swordType === 2) {
          // 왕관 형태 빛 입자 (제왕의 위엄)
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: [0, 0.8, 0.6, 0],
                y: [-20, 30, 60, 100]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity, 
                delay: particle.delay,
                ease: "easeIn"
              }}
              style={{ 
                ...baseStyle,
                width: particle.size * 1.5,
                height: particle.size * 1.5,
                background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${primaryColor} 50%, transparent 100%)`,
                borderRadius: '50%',
                boxShadow: `0 0 ${particle.size}px ${primaryColor}`
              }}
            />
          );
        } else {
          // 검기 잔상
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0.4, 0],
                scaleY: [0, 1, 1.2, 0]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity, 
                delay: particle.delay * 1.2,
                repeatDelay: 1.8
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.7 + 15}%`,
                top: '10%',
                width: '1px',
                height: '80px',
                background: `linear-gradient(180deg, transparent, ${hexToRgba(primaryColor, 0.7)}, transparent)`,
                boxShadow: `0 0 5px ${hexToRgba(primaryColor, 0.5)}`
              }}
            />
          );
        }
      
      case '중검': // 종남파 - 무거운 검의 중량감, 압도적인 힘
        const heavyType = particle.id % 4;
        if (heavyType === 0) {
          // 땅을 짓누르는 압력파
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scaleX: 0, scaleY: 0.2 }}
              animate={{ 
                opacity: [0, 0.7, 0.5, 0],
                scaleX: [0, 1.5, 2.5, 3],
                scaleY: [0.2, 0.15, 0.1, 0]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity, 
                delay: particle.delay * 2,
                repeatDelay: 2,
                ease: "easeOut"
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.6 + 20}%`,
                top: `${particle.y * 0.4 + 50}%`,
                width: '60px',
                height: '30px',
                borderRadius: '50%',
                background: `radial-gradient(ellipse, ${hexToRgba(primaryColor, 0.6)} 0%, transparent 70%)`,
                boxShadow: `0 0 20px ${hexToRgba(primaryColor, 0.4)}`
              }}
            />
          );
        } else if (heavyType === 1) {
          // 무거운 검의 궤적 - 느리지만 압도적
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.8, 0.9, 0],
                rotate: [-45, 0, 15, 30],
                scale: [0.5, 1, 1.1, 0.8]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity, 
                delay: particle.delay * 1.5,
                repeatDelay: 2,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.5 + 25}%`,
                top: `${particle.y * 0.5 + 20}%`,
                width: '8px',
                height: '80px',
                background: `linear-gradient(180deg, 
                  transparent 0%, 
                  ${primaryColor}88 10%,
                  ${primaryColor} 30%, 
                  #666666 50%, 
                  ${primaryColor} 70%,
                  ${primaryColor}88 90%,
                  transparent 100%)`,
                borderRadius: '4px',
                boxShadow: `0 0 15px ${primaryColor}, 0 0 30px ${hexToRgba(primaryColor, 0.3)}`,
                transformOrigin: 'center center'
              }}
            />
          );
        } else if (heavyType === 2) {
          // 충격파 파편
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0.5, 0],
                y: [0, Math.cos(particle.id) * 40, Math.cos(particle.id) * 60],
                x: [0, Math.sin(particle.id) * 30, Math.sin(particle.id) * 50]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity, 
                delay: particle.delay * 2,
                repeatDelay: 2.5
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.4 + 30}%`,
                top: `${particle.y * 0.4 + 30}%`,
                width: particle.size * 0.8,
                height: particle.size * 1.2,
                background: primaryColor,
                borderRadius: '2px',
                transform: `rotate(${particle.id * 45}deg)`,
                boxShadow: `0 0 5px ${primaryColor}`
              }}
            />
          );
        } else {
          // 묵직한 기운 (안개처럼 깔리는)
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0.4, 0.2, 0],
                scale: [0.8, 1.2, 1.5, 1.8, 2]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity, 
                delay: particle.delay,
                ease: "easeInOut"
              }}
              style={{ 
                ...baseStyle,
                left: `${particle.x * 0.6 + 20}%`,
                top: `${particle.y * 0.5 + 30}%`,
                width: particle.size * 5,
                height: particle.size * 3,
                borderRadius: '50%',
                background: `radial-gradient(ellipse, ${hexToRgba(primaryColor, 0.4)} 0%, transparent 70%)`,
                filter: 'blur(4px)'
              }}
            />
          );
        }

      default:
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration + 1, repeat: Infinity, delay: particle.delay }}
            style={{ ...baseStyle, width: particle.size * 2, height: particle.size * 2, borderRadius: '50%',
              background: `radial-gradient(circle, ${hexToRgba(primaryColor, 0.5)} 0%, transparent 70%)` }}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        left: '-30%',
        right: '-30%',
        top: '-30%',
        bottom: '-30%',
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: -1
      }}
    >
      {/* 중앙 글로우 */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          left: '15%',
          right: '15%',
          top: '15%',
          bottom: '15%',
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${hexToRgba(primaryColor, 0.3)} 0%, transparent 70%)`,
          filter: 'blur(20px)'
        }}
      />
      {particles.map(renderParticle)}
    </motion.div>
  );
});

// ============================================================
// 문파별 비주얼 이펙트 컴포넌트 (카드 내부 - 사용하지 않음)
// ============================================================
function FactionVisualEffect({ faction, primaryColor }: { faction: Faction; primaryColor: string }) {
  const effectType = faction.effectType || '수묵';
  const particleCount = faction.particleCount || 20;
  
  // 파티클 생성
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2
    }));
  }, [particleCount]);

  // 효과 타입별 렌더링
  const renderParticle = (particle: typeof particles[0]) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      pointerEvents: 'none'
    };

    switch (effectType) {
      case '금광': // 소림 - 황금빛 불꽃
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5],
              y: [0, -30, 0]
            }}
            transition={{ duration: particle.duration + 1, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size + 4,
              height: particle.size + 4,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size * 2}px ${primaryColor}`
            }}
          />
        );

      case '수묵': // 무당 - 수묵 산수
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0.5, 2, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: particle.duration + 2, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 2,
              height: particle.size * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(60, 60, 80, 0.6) 0%, transparent 70%)`,
              filter: 'blur(2px)'
            }}
          />
        );

      case '꽃잎': // 화산 - 매화 꽃잎
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.9, 0],
              y: [0, 150, 300],
              x: [0, Math.sin(particle.id) * 50, Math.sin(particle.id) * 100],
              rotate: [0, 360, 720]
            }}
            transition={{ duration: particle.duration + 3, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size,
              height: particle.size * 1.5,
              borderRadius: '50% 0 50% 50%',
              background: primaryColor,
              transform: 'rotate(45deg)'
            }}
          />
        );

      case '번개': // 남궁/곤륜 - 번개 섬광
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0, 0.8, 0]
            }}
            transition={{ duration: 0.3, repeat: Infinity, delay: particle.delay * 2, repeatDelay: particle.duration }}
            style={{
              ...baseStyle,
              width: 2,
              height: particle.size * 4,
              background: `linear-gradient(180deg, ${primaryColor}, transparent)`,
              boxShadow: `0 0 10px ${primaryColor}`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`
            }}
          />
        );

      case '화염': // 마교 - 불꽃
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: [0, 0.9, 0],
              y: [50, -100],
              scale: [0.5, 1.2, 0]
            }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size,
              height: particle.size * 1.5,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `linear-gradient(0deg, ${primaryColor}, #ff6b35, #ffcc00)`,
              boxShadow: `0 0 ${particle.size}px ${primaryColor}`,
              filter: 'blur(1px)'
            }}
          />
        );

      case '빙설': // 북해빙궁 - 눈송이
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              y: [0, 200],
              x: [0, Math.sin(particle.id) * 30]
            }}
            transition={{ duration: particle.duration + 2, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: `0 0 ${particle.size}px rgba(200, 230, 255, 0.8)`
            }}
          />
        );

      case '독기': // 사천당가/청성 - 독 안개
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0.5, 2, 0.5],
              x: [0, Math.sin(particle.id * 0.5) * 40, 0]
            }}
            transition={{ duration: particle.duration + 2, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 3,
              height: particle.size * 3,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor}88 0%, transparent 70%)`,
              filter: 'blur(4px)'
            }}
          />
        );

      case '물결': // 수로채 - 물이 퍼지는 파동
        const waterType = particle.id % 4;
        if (waterType === 0) {
          // 중심에서 퍼지는 원형 파동 (동심원)
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0.4, 0],
                scale: [0, 1, 2.5, 4]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: particle.delay * 2 }}
              style={{
                ...baseStyle,
                width: particle.size * 8,
                height: particle.size * 4,
                borderRadius: '50%',
                border: `2px solid ${primaryColor}`,
                background: 'transparent',
                boxShadow: `0 0 10px ${primaryColor}40`
              }}
            />
          );
        } else if (waterType === 1) {
          // 물결 흔들림 효과
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, x: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0.4, 0],
                x: [0, 30, -20, 40, 0],
                scaleX: [1, 1.2, 0.9, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: particle.size * 10,
                height: particle.size * 0.5,
                borderRadius: '50%',
                background: `linear-gradient(90deg, transparent, ${primaryColor}80, transparent)`,
                filter: 'blur(1px)'
              }}
            />
          );
        } else if (waterType === 2) {
          // 물방울 튀김
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{ 
                opacity: [0, 0.9, 0.7, 0],
                y: [0, -40, -30, 20],
                scale: [0.5, 1.2, 1, 0]
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: particle.delay * 1.5, repeatDelay: 1 }}
              style={{
                ...baseStyle,
                width: particle.size,
                height: particle.size * 1.4,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, ${primaryColor} 100%)`,
                boxShadow: `0 0 8px ${primaryColor}`
              }}
            />
          );
        } else {
          // 수면 반짝임
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.7, 0.3, 0.8, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: particle.size * 3,
                height: particle.size,
                borderRadius: '50%',
                background: `radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, ${primaryColor}60 50%, transparent 100%)`
              }}
            />
          );
        }

      case '바람': // 개방 - 바람 흐름
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              x: [-50, 200]
            }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 6,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${primaryColor}66, transparent)`,
              borderRadius: '2px'
            }}
          />
        );

      case '낙엽': // 종남 - 낙엽 비
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: -20, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              y: [0, 200],
              x: [0, Math.sin(particle.id) * 60],
              rotate: [0, 360]
            }}
            transition={{ duration: particle.duration + 2, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size,
              height: particle.size * 0.7,
              borderRadius: '50%',
              background: primaryColor
            }}
          />
        );

      case '혈기': // 혈교 - 붉은 기운
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.5, 0.5],
              y: [0, -50, 0]
            }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 2,
              height: particle.size * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
              filter: 'blur(2px)'
            }}
          />
        );

      case '암영': // 하오문 - 그림자
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0]
            }}
            transition={{ duration: particle.duration + 1, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 3,
              height: particle.size * 3,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, transparent 70%)',
              filter: 'blur(3px)'
            }}
          />
        );

      case '안개': // 태거기/자객 - 안개
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              x: [0, 30, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ duration: particle.duration + 2, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 5,
              height: particle.size * 3,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, rgba(200, 200, 200, 0.5) 0%, transparent 70%)`,
              filter: 'blur(5px)'
            }}
          />
        );

      case '성진': // 공동파 - 별빛 점
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size,
              height: particle.size,
              background: primaryColor,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              boxShadow: `0 0 ${particle.size}px ${primaryColor}`
            }}
          />
        );

      case '음파': // 소림 (음공) - 파동
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0.5, 2.5, 4]
            }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 4,
              height: particle.size * 4,
              borderRadius: '50%',
              border: `1px solid ${primaryColor}`,
              background: 'transparent'
            }}
          />
        );

      case '제왕검기': // 남궁세가 - 상단에서 하단으로 내려치는 제왕의 검
        const kingType = particle.id % 3;
        if (kingType === 0) {
          // 수직 하강 검기 - 상단에서 하단으로
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: -100 }}
              animate={{ 
                opacity: [0, 0.9, 0.8, 0],
                y: [-100, 0, 50, 120]
              }}
              transition={{ duration: 0.8, repeat: Infinity, delay: particle.delay * 1.5, repeatDelay: 1.5 }}
              style={{
                ...baseStyle,
                width: 4,
                height: particle.size * 12,
                background: `linear-gradient(180deg, ${primaryColor}, rgba(255,255,255,0.95), ${primaryColor})`,
                boxShadow: `0 0 ${particle.size * 2}px ${primaryColor}, 0 0 ${particle.size * 4}px ${primaryColor}40`,
                borderRadius: '2px'
              }}
            />
          );
        } else if (kingType === 1) {
          // 대각선 검기 - 위에서 아래로 베어내림
          const slashAngle = particle.id % 2 === 0 ? 30 : -30;
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: [0, 1, 0.7, 0],
                scaleX: [0, 1, 1, 0]
              }}
              transition={{ duration: 0.4, repeat: Infinity, delay: particle.delay * 2, repeatDelay: 2 }}
              style={{
                ...baseStyle,
                width: particle.size * 15,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${primaryColor}, rgba(255,255,255,0.9), ${primaryColor}, transparent)`,
                boxShadow: `0 0 15px ${primaryColor}`,
                transform: `rotate(${slashAngle}deg)`,
                transformOrigin: 'left center'
              }}
            />
          );
        } else {
          // 왕기 입자 - 위에서 아래로 떨어지는 빛
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: -50 }}
              animate={{ 
                opacity: [0, 0.7, 0.5, 0],
                y: [-50, 20, 60, 100]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: particle.size * 2,
                height: particle.size * 2,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${primaryColor} 60%, transparent 100%)`,
                boxShadow: `0 0 ${particle.size}px ${primaryColor}`
              }}
            />
          );
        }

      case '명왕빛': // 명교 - 명왕의 빛
        return particle.id % 3 === 0 ? (
          // 빛 형태
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.7, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 45]
            }}
            transition={{ duration: particle.duration * 1.5, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 2,
              height: particle.size * 2,
              background: `radial-gradient(circle, ${primaryColor} 0%, rgba(142, 68, 173, 0.5) 60%, transparent 100%)`,
              clipPath: 'polygon(50% 0%, 65% 35%, 100% 35%, 75% 55%, 85% 100%, 50% 70%, 15% 100%, 25% 55%, 0% 35%, 35% 35%)',
              boxShadow: `0 0 ${particle.size * 2}px ${primaryColor}`
            }}
          />
        ) : (
          // 입자
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, y: 80 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [80, -50]
            }}
            transition={{ duration: particle.duration * 1.5, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: primaryColor,
              boxShadow: `0 0 ${particle.size}px ${primaryColor}`
            }}
          />
        );

      case '운룡뇌전': // 곤륜파 - 뇌전과 구름
        return particle.id % 4 === 0 ? (
          // 뇌전
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0, 0.8, 0]
            }}
            transition={{ duration: 0.2, repeat: Infinity, delay: particle.delay * 2, repeatDelay: particle.duration * 1.5 }}
            style={{
              ...baseStyle,
              width: 3,
              height: particle.size * 6,
              background: `linear-gradient(180deg, #F1C40F, ${primaryColor}, transparent)`,
              boxShadow: `0 0 ${particle.size}px #F1C40F, 0 0 ${particle.size * 2}px ${primaryColor}`,
              clipPath: 'polygon(30% 0%, 100% 30%, 40% 35%, 90% 60%, 35% 65%, 75% 100%, 50% 90%, 20% 65%, 60% 55%, 10% 30%, 50% 25%)',
              transform: `rotate(${Math.random() * 20 - 10}deg)`
            }}
          />
        ) : (
          // 구름
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              x: [-20, 100]
            }}
            transition={{ duration: particle.duration * 2, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 4,
              height: particle.size * 2,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${primaryColor}60 0%, transparent 70%)`,
              filter: 'blur(2px)'
            }}
          />
        );

      case '황권': // 관부 - 황실의 권위
        const imperialType = particle.id % 4;
        if (imperialType === 0) {
          // 용린 (Dragon Scale) - 금빛 비늘이 올라감
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 100, rotateY: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0.6, 0],
                y: [100, -20],
                rotateY: [0, 180, 360]
              }}
              transition={{ duration: particle.duration * 1.5, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: particle.size * 1.5,
                height: particle.size * 2,
                background: `linear-gradient(135deg, #FFD700 0%, #D4AC0D 40%, #B8860B 60%, #FFD700 100%)`,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                boxShadow: `0 0 ${particle.size}px #FFD700, inset 0 0 ${particle.size/2}px rgba(255,255,255,0.5)`,
                transformStyle: 'preserve-3d'
              }}
            />
          );
        } else if (imperialType === 1) {
          // 옥새빛 (Imperial Seal Glow) - 붉은 도장 빛이 반짝이며 올라감
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 80, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.9, 0.7, 0],
                y: [80, -30],
                scale: [0.5, 1.2, 0.8]
              }}
              transition={{ duration: particle.duration * 1.3, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: particle.size * 1.8,
                height: particle.size * 1.8,
                background: `radial-gradient(circle, #C0392B 0%, #7B241C 50%, transparent 70%)`,
                borderRadius: '15%',
                boxShadow: `0 0 ${particle.size * 1.5}px #C0392B, 0 0 ${particle.size * 2}px rgba(192, 57, 43, 0.5)`,
                border: '1px solid rgba(212, 172, 13, 0.6)'
              }}
            />
          );
        } else if (imperialType === 2) {
          // 금사 (Golden Thread) - 황금 실이 올라가며 휘날림
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 100, x: 0 }}
              animate={{ 
                opacity: [0, 0.7, 0.5, 0],
                y: [100, -40],
                x: [0, Math.sin(particle.id) * 30, 0]
              }}
              transition={{ duration: particle.duration * 1.8, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: 2,
                height: particle.size * 4,
                background: `linear-gradient(180deg, transparent, #FFD700, #D4AC0D, #FFD700, transparent)`,
                boxShadow: `0 0 ${particle.size}px #FFD700`,
                borderRadius: '2px',
                transform: `rotate(${Math.sin(particle.id * 0.5) * 15}deg)`
              }}
            />
          );
        } else {
          // 황금 기운 (Imperial Aura) - 장엄한 금빛 입자
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 60, scale: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0.4, 0],
                y: [60, -50],
                scale: [0, 1.5, 1]
              }}
              transition={{ duration: particle.duration * 2, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: particle.size * 2.5,
                height: particle.size * 2.5,
                background: `radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(212, 172, 13, 0.4) 40%, transparent 70%)`,
                borderRadius: '50%',
                boxShadow: `0 0 ${particle.size * 2}px rgba(255, 215, 0, 0.6), 0 0 ${particle.size * 3}px rgba(212, 172, 13, 0.3)`
              }}
            />
          );
        }

      case '중검': // 종남파 - 무거운 검의 중량감과 압도적인 힘
        const heavySwordType = particle.id % 4;
        if (heavySwordType === 0) {
          // 땅을 짓누르는 압력파
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0.4, 0],
                scaleX: [0, 2, 3, 4],
                scaleY: [1, 0.5, 0.3, 0.1]
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: particle.delay * 2, repeatDelay: 2 }}
              style={{
                ...baseStyle,
                width: particle.size * 10,
                height: particle.size * 4,
                borderRadius: '50%',
                background: `radial-gradient(ellipse, ${primaryColor}80 0%, transparent 70%)`,
                boxShadow: `0 0 30px ${primaryColor}40`
              }}
            />
          );
        } else if (heavySwordType === 1) {
          // 느리지만 압도적인 검의 궤적
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, rotate: -60, scale: 0.3 }}
              animate={{ 
                opacity: [0, 0.9, 0.7, 0],
                rotate: [-60, -15, 15, 45],
                scale: [0.3, 1, 1.1, 0.8]
              }}
              transition={{ duration: 1.8, repeat: Infinity, delay: particle.delay * 1.5, repeatDelay: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                ...baseStyle,
                width: '12px',
                height: particle.size * 12,
                background: `linear-gradient(180deg, 
                  transparent 0%, 
                  ${primaryColor}66 10%,
                  ${primaryColor} 30%, 
                  #8B8B8B 50%, 
                  ${primaryColor} 70%,
                  ${primaryColor}66 90%,
                  transparent 100%)`,
                borderRadius: '4px',
                boxShadow: `0 0 20px ${primaryColor}, 0 0 40px ${primaryColor}40`,
                transformOrigin: 'center center'
              }}
            />
          );
        } else if (heavySwordType === 2) {
          // 충격파로 튀어나가는 파편
          const angle = (particle.id * 72) % 360;
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.9, 0.5, 0],
                scale: [0, 1, 0.8, 0],
                x: [0, Math.cos(angle * Math.PI / 180) * 80],
                y: [0, Math.sin(angle * Math.PI / 180) * 60]
              }}
              transition={{ duration: 0.8, repeat: Infinity, delay: particle.delay * 2, repeatDelay: 2.5 }}
              style={{
                ...baseStyle,
                width: particle.size,
                height: particle.size * 1.5,
                background: primaryColor,
                borderRadius: '2px',
                transform: `rotate(${angle}deg)`,
                boxShadow: `0 0 8px ${primaryColor}`
              }}
            />
          );
        } else {
          // 묵직한 기운 (안개처럼 깔림)
          return (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.4, 0.5, 0.3, 0],
                scale: [0.5, 1, 1.5, 2, 2.5]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: particle.delay }}
              style={{
                ...baseStyle,
                width: particle.size * 8,
                height: particle.size * 5,
                borderRadius: '50%',
                background: `radial-gradient(ellipse, ${primaryColor}50 0%, transparent 70%)`,
                filter: 'blur(5px)'
              }}
            />
          );
        }

      default:
        return (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{ duration: particle.duration + 1, repeat: Infinity, delay: particle.delay }}
            style={{
              ...baseStyle,
              width: particle.size * 2,
              height: particle.size * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor}66 0%, transparent 70%)`
            }}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5
      }}
    >
      {particles.map(renderParticle)}
    </motion.div>
  );
}












