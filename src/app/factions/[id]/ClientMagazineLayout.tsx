"use client";

import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Faction, getFactionById } from "@/data/factions";
import { getCharactersByFaction, Character, EXPRESSION_LABELS } from "@/data/characters";
import { useAudio } from "@/components/AudioManager";

// 드래그 스크롤 훅
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.cursor = 'grab';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.cursor = 'grab';
    }
  }, []);

  // 터치 지원
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !ref.current) return;
    const x = e.touches[0].pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    ref,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
}

interface Props {
    faction: Faction;
}

// 등급별 색상
const RANK_COLORS: Record<string, string> = {
  S: "#fbbf24",
  A: "#a855f7",
  B: "#3b82f6",
  C: "#6b7280",
  D: "#78716c",
};

// 경지별 색상
const REALM_COLORS: Record<string, string> = {
  "현경": "#fbbf24",
  "화경": "#f97316",
  "초절정": "#a855f7",
  "절정": "#3b82f6",
  "1류": "#22c55e",
  "2류": "#6b7280",
  "3류": "#78716c",
};

// 세력 이름 매핑
const FACTION_NAME_MAP: Record<string, string> = {
  shaolin: "소림사",
  wudang: "무당파",
  hwasan: "화산파",
  ami: "아미파",
  kunlun: "곤륜파",
  jeomchang: "점창파",
  kongdong: "공동파",
  cheongseong: "청성파",
  jongnam: "종남파",
  gaebang: "개방",
  namgung: "남궁세가",
  sacheon: "사천당가",
  habuk: "하북팽가",
  moyong: "모용세가",
  jegal: "제갈세가",
  sapa_union: "녹림",
  suro: "수로채",
  haomun: "하오문",
  salsu: "살수막",
  cheonma: "천마신교",
  blood_sect: "혈교",
  imperial: "관부",
  north_ice: "북해빙궁",
  beast_palace: "남만야수궁",
  hidden_masters: "은거기인"
};

// ============================================
// 수묵화 배경 파티클 컴포넌트
// ============================================
function InkParticles({ color, opacity = 0.1 }: { color: string; opacity?: number }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const count = 30;
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 40,
        duration: Math.random() * 15 + 20,
        delay: Math.random() * 8,
      }))
    );
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      overflow: 'hidden', 
      pointerEvents: 'none',
      opacity,
      zIndex: 1
    }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 0.3, 0.1, 0.3, 0],
            scale: [0.5, 1, 0.8, 1, 0.5],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// 세로 장식 텍스트 컴포넌트
// ============================================
function VerticalDecorationText({ text, side, color }: { text: string; side: 'left' | 'right'; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      style={{
        position: 'fixed',
        [side]: 'clamp(15px, 3vw, 40px)',
        top: '50%',
        transform: 'translateY(-50%)',
        writingMode: 'vertical-rl',
        fontSize: 'clamp(10px, 1.5vw, 14px)',
        letterSpacing: '0.5em',
        color: color,
        fontFamily: '"Nanum Myeongjo", serif',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {text}
    </motion.div>
  );
}

// ============================================
// 두루마리 프레임 장식
// ============================================
function ScrollFrame({ color }: { color: string }) {
  return (
    <>
      {/* 상단 장식 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, transparent 0%, ${color}40 20%, ${color}60 50%, ${color}40 80%, transparent 100%)`,
        zIndex: 50,
      }} />
      
      {/* 하단 장식 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, transparent 0%, ${color}40 20%, ${color}60 50%, ${color}40 80%, transparent 100%)`,
        zIndex: 50,
      }} />
      
      {/* 좌측 장식 */}
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: '4px',
        background: `linear-gradient(180deg, transparent 0%, ${color}40 20%, ${color}60 50%, ${color}40 80%, transparent 100%)`,
        zIndex: 50,
      }} />
      
      {/* 우측 장식 */}
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        width: '4px',
        background: `linear-gradient(180deg, transparent 0%, ${color}40 20%, ${color}60 50%, ${color}40 80%, transparent 100%)`,
        zIndex: 50,
      }} />
      
      {/* 모서리 장식들 */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          style={{
            position: 'fixed',
            [corner.includes('top') ? 'top' : 'bottom']: '10px',
            [corner.includes('left') ? 'left' : 'right']: '10px',
            width: '25px',
            height: '25px',
            borderTop: corner.includes('top') ? `2px solid ${color}60` : 'none',
            borderBottom: corner.includes('bottom') ? `2px solid ${color}60` : 'none',
            borderLeft: corner.includes('left') ? `2px solid ${color}60` : 'none',
            borderRight: corner.includes('right') ? `2px solid ${color}60` : 'none',
            zIndex: 51,
          }}
        />
      ))}
    </>
  );
}

// ============================================
// 섹션 헤더 컴포넌트 (정통 무협 스타일)
// ============================================
function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        textAlign: 'center',
        marginBottom: 'clamp(40px, 8vh, 80px)',
      }}
    >
      {/* 상단 장식선 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '25px',
      }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            width: '60px',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${color})`,
            transformOrigin: 'right',
          }}
        />
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.4em',
          color: color,
          opacity: 0.7,
          textTransform: 'uppercase',
        }}>
          {subtitle}
        </span>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            width: '60px',
            height: '1px',
            background: `linear-gradient(90deg, ${color}, transparent)`,
            transformOrigin: 'left',
          }}
        />
      </div>
      
      {/* 제목 */}
      <h2 style={{
        fontSize: 'clamp(1.8rem, 5vw, 3rem)',
        fontWeight: 300,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '15px',
      }}>
        {title}
      </h2>
      
      {/* 하단 장식 */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          width: '40px',
          height: '2px',
          background: color,
          margin: '0 auto',
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
}

// ============================================
// 메인 레이아웃 컴포넌트
// ============================================
export default function ClientMagazineLayout({ faction }: Props) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const { playHover, playClick } = useAudio();

    // 캐릭터 데이터 로드
    const characters = useMemo(() => getCharactersByFaction(faction.id), [faction.id]);
    const leader = useMemo(() => characters.find(c => c.id === faction.leader), [characters, faction.leader]);

    // 캐릭터 모달 상태
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    
    // 이미지 갤러리 뷰어 상태 (화첩용)
    const [galleryCharacter, setGalleryCharacter] = useState<Character | null>(null);

    // Parallax 효과
    const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.95]);

    const accentColor = faction.colors.accent;

    return (
        <div 
          ref={containerRef} 
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#0a0908',
            color: '#fff',
            overflowX: 'hidden',
            fontFamily: '"Nanum Myeongjo", serif',
          }}
        >
            {/* 문파별 배경 이미지 */}
            <div style={{
              position: 'fixed',
              inset: 0,
              backgroundImage: `url('/images/bg/${faction.code}.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              filter: 'grayscale(40%)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />
            {/* 배경 이미지 위 어두운 그라데이션 */}
            <div style={{
              position: 'fixed',
              inset: 0,
              background: `linear-gradient(180deg, rgba(10,9,8,0.7) 0%, rgba(10,9,8,0.85) 50%, rgba(10,9,8,0.95) 100%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* 두루마리 프레임 */}
            <ScrollFrame color={accentColor} />

            {/* 수묵화 파티클 배경 */}
            <InkParticles color={accentColor} opacity={0.08} />

            {/* 한지 텍스처 */}
            <div style={{
              position: 'fixed',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              opacity: 0.025,
              pointerEvents: 'none',
              zIndex: 2,
            }} />

            {/* 비네트 효과 */}
            <div style={{
              position: 'fixed',
              inset: 0,
              background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(10, 9, 8, 0.4) 70%, rgba(10, 9, 8, 0.85) 100%)`,
              pointerEvents: 'none',
              zIndex: 3,
            }} />

            {/* 세로 장식 텍스트 */}
            <VerticalDecorationText 
              text={faction.hanja || faction.code} 
              side="left" 
              color={accentColor} 
            />
            <VerticalDecorationText 
              text="武林秘傳" 
              side="right" 
              color={accentColor} 
            />

            {/* 상단 네비게이션 */}
            <nav style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              padding: 'clamp(15px, 3vh, 25px) clamp(20px, 5vw, 50px)',
            }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <motion.button 
                    onClick={() => {
                      playClick();
                      // 문파 카테고리에 따라 해당 문파 선택 화면으로 이동
                      const category = faction.category;
                      if (category === 'orthodox') {
                        // 정파는 구파일방/오대세가 선택화면으로
                        router.push('/?screen=orthodox-selection');
                      } else if (category === 'unorthodox') {
                        // 사파 로비로
                        router.push('/?screen=lobby&group=unorthodox');
                      } else if (category === 'demonic') {
                        // 마교 로비로
                        router.push('/?screen=lobby&group=demonic');
                      } else {
                        // 기타 (세외, 은거, 관부)
                        router.push('/?screen=lobby&group=' + category);
                      }
                    }}
                    onMouseEnter={playHover}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'rgba(255,255,255,0.5)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: '"Nanum Myeongjo", serif',
                    }}
                    whileHover={{ x: -5, color: '#fff' }}
                >
                    <span style={{ fontSize: '16px' }}>◂</span>
                    <span style={{ 
                      fontSize: '12px', 
                      letterSpacing: '0.2em',
                    }}>
                      돌아가기
                    </span>
                </motion.button>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ 
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <span style={{
                    fontSize: '11px',
                    letterSpacing: '0.5em',
                    color: accentColor,
                    opacity: 0.6,
                  }}>
                    {faction.code}
                  </span>
                </motion.div>
                
                <Link href="/characters" style={{ textDecoration: 'none' }}>
                    <motion.button 
                      onClick={playClick}
                      onMouseEnter={playHover}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: 'rgba(255,255,255,0.5)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: '"Nanum Myeongjo", serif',
                        fontSize: '12px',
                        letterSpacing: '0.2em',
                      }}
                      whileHover={{ x: 5, color: '#fff' }}
                    >
                        <span>인물록</span>
                        <span style={{ fontSize: '16px' }}>▸</span>
                    </motion.button>
                </Link>
              </div>
            </nav>

            {/* ============================================ */}
            {/* 히어로 섹션 - 정통 무협 두루마리 스타일 */}
            {/* ============================================ */}
            <motion.section 
              style={{ 
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
                {/* 배경 비네트 그라디언트 */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    radial-gradient(ellipse 60% 40% at 50% 50%, ${faction.colors.primary}15 0%, transparent 60%),
                    radial-gradient(ellipse 40% 30% at 50% 55%, ${faction.colors.secondary}10 0%, transparent 50%)
                  `,
                }} />

                {/* 거대 한자 배경 */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.025 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      fontSize: 'clamp(280px, 55vw, 700px)',
                      fontFamily: '"Nanum Myeongjo", serif',
                      fontWeight: 400,
                      color: accentColor,
                      lineHeight: 1,
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                >
                    {faction.hanja?.charAt(0) || faction.name.charAt(0)}
                </motion.div>

                {/* 메인 타이틀 콘텐츠 */}
                <motion.div 
                  style={{ 
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    padding: '0 clamp(20px, 5vw, 50px)',
                    maxWidth: '900px',
                  }}
                >
                    {/* 상단 문양 */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '30px',
                        marginBottom: 'clamp(30px, 5vh, 50px)',
                      }}
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{
                          width: 'clamp(40px, 8vw, 80px)',
                          height: '1px',
                          background: `linear-gradient(90deg, transparent, ${accentColor})`,
                          transformOrigin: 'right',
                        }}
                      />
                      <div style={{
                        width: '8px',
                        height: '8px',
                        border: `1px solid ${accentColor}`,
                        transform: 'rotate(45deg)',
                        opacity: 0.6,
                      }} />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{
                          width: 'clamp(40px, 8vw, 80px)',
                          height: '1px',
                          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                          transformOrigin: 'left',
                        }}
                      />
                    </motion.div>

                    {/* 한자명 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        style={{
                          fontSize: 'clamp(2rem, 7vw, 4rem)',
                          letterSpacing: '0.4em',
                          color: accentColor,
                          marginBottom: 'clamp(15px, 2vh, 25px)',
                          fontWeight: 300,
                          textShadow: `0 0 60px ${accentColor}30`,
                        }}
                    >
                        {faction.hanja}
                    </motion.div>

                    {/* 문파명 */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        style={{
                          fontSize: 'clamp(3rem, 12vw, 7rem)',
                          fontWeight: 300,
                          letterSpacing: '0.15em',
                          color: '#fff',
                          marginBottom: 'clamp(30px, 5vh, 50px)',
                          textShadow: `0 0 80px ${accentColor}20, 0 4px 20px rgba(0,0,0,0.5)`,
                        }}
                    >
                        {faction.name.split('(')[0].trim()}
                    </motion.h1>

                    {/* 분류 태그 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '15px',
                          marginBottom: 'clamp(40px, 6vh, 60px)',
                        }}
                    >
                      <span style={{
                        padding: '8px 20px',
                        border: `1px solid ${accentColor}50`,
                        color: accentColor,
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        background: `${accentColor}10`,
                      }}>
                        {faction.category || '무림세가'}
                      </span>
                    </motion.div>

                    {/* 하단 장식선 */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        style={{
                          width: 'clamp(80px, 15vw, 150px)',
                          height: '2px',
                          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
                          margin: '0 auto clamp(40px, 6vh, 60px) auto',
                        }}
                    />

                    {/* 설명문 */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        style={{
                          fontSize: 'clamp(14px, 2vw, 18px)',
                          lineHeight: 2.2,
                          color: 'rgba(255,255,255,0.7)',
                          maxWidth: '700px',
                          margin: '0 auto',
                          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        }}
                    >
                        {faction.desc}
                    </motion.p>
                </motion.div>

                {/* 스크롤 유도 */}
                <motion.div
                    style={{
                      position: 'absolute',
                      bottom: 'clamp(40px, 8vh, 80px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{
                        fontSize: '9px',
                        letterSpacing: '0.3em',
                        color: 'rgba(255,255,255,0.25)',
                      }}>
                        下
                      </span>
                      <motion.div 
                        style={{
                          width: '1px',
                          height: '30px',
                          background: `linear-gradient(180deg, ${accentColor}40, transparent)`,
                        }}
                        animate={{ scaleY: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* ============================================ */}
            {/* 이념 & 무공 섹션 */}
            {/* ============================================ */}
            <section style={{
              position: 'relative',
              padding: 'clamp(60px, 15vh, 150px) clamp(20px, 5vw, 60px)',
              zIndex: 10,
            }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'clamp(40px, 8vh, 80px)',
                }}>
                    {/* 이념/철학 카드 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                        style={{
                          padding: 'clamp(25px, 5vh, 40px)',
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(20,18,15,0.4) 100%)',
                          border: `1px solid ${accentColor}20`,
                          position: 'relative',
                        }}
                    >
                        {/* 카드 상단 장식 */}
                        <div style={{
                          position: 'absolute',
                          top: '-1px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '40%',
                          height: '2px',
                          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
                        }} />
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          marginBottom: '25px',
                        }}>
                          <span style={{
                            color: accentColor,
                            fontSize: '20px',
                            opacity: 0.7,
                          }}>理</span>
                          <div style={{
                            flex: 1,
                            height: '1px',
                            background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
                          }} />
                          <span style={{
                            fontSize: '10px',
                            letterSpacing: '0.3em',
                            color: 'rgba(255,255,255,0.35)',
                          }}>
                            이념
                          </span>
                        </div>
                        
                        {faction.philosophy ? (
                            <blockquote style={{
                              fontSize: 'clamp(15px, 2vw, 18px)',
                              lineHeight: 2,
                              color: 'rgba(255,255,255,0.8)',
                              paddingLeft: '20px',
                              borderLeft: `2px solid ${accentColor}50`,
                              fontStyle: 'italic',
                            }}>
                                「{faction.philosophy}」
                            </blockquote>
                        ) : (
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                              비전의 이념...
                            </p>
                        )}
                    </motion.div>

                    {/* 대표 무공 카드 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{
                          padding: 'clamp(25px, 5vh, 40px)',
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(20,18,15,0.4) 100%)',
                          border: `1px solid ${accentColor}20`,
                          position: 'relative',
                        }}
                    >
                        {/* 카드 상단 장식 */}
                        <div style={{
                          position: 'absolute',
                          top: '-1px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '40%',
                          height: '2px',
                          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
                        }} />
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          marginBottom: '25px',
                        }}>
                          <span style={{
                            color: accentColor,
                            fontSize: '20px',
                            opacity: 0.7,
                          }}>武</span>
                          <div style={{
                            flex: 1,
                            height: '1px',
                            background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
                          }} />
                          <span style={{
                            fontSize: '10px',
                            letterSpacing: '0.3em',
                            color: 'rgba(255,255,255,0.35)',
                          }}>
                            무공
                          </span>
                        </div>
                        
                        {faction.signature_skills && faction.signature_skills.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {faction.signature_skills.map((skill, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        viewport={{ once: true }}
                                        style={{
                                          padding: '10px 18px',
                                          border: `1px solid ${accentColor}40`,
                                          color: accentColor,
                                          fontSize: '13px',
                                          letterSpacing: '0.1em',
                                          background: `${accentColor}08`,
                                          cursor: 'default',
                                        }}
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                              비전 무공...
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* 역사 섹션 */}
                {faction.history && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                        style={{
                          marginTop: 'clamp(60px, 12vh, 120px)',
                          textAlign: 'center',
                          maxWidth: '800px',
                          margin: 'clamp(60px, 12vh, 120px) auto 0 auto',
                        }}
                    >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '20px',
                          marginBottom: '35px',
                        }}>
                          <div style={{
                            width: '50px',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${accentColor}40)`,
                          }} />
                          <span style={{
                            color: accentColor,
                            fontSize: '18px',
                            opacity: 0.6,
                          }}>史</span>
                          <div style={{
                            width: '50px',
                            height: '1px',
                            background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
                          }} />
                        </div>
                        
                        <p style={{
                          fontSize: 'clamp(14px, 2vw, 17px)',
                          lineHeight: 2.2,
                          color: 'rgba(255,255,255,0.65)',
                        }}>
                          {faction.history}
                        </p>
                    </motion.div>
                )}
              </div>
            </section>

            {/* ============================================ */}
            {/* 주요 인물 섹션 */}
            {/* ============================================ */}
            <section style={{
              position: 'relative',
              padding: 'clamp(60px, 15vh, 150px) clamp(20px, 5vw, 60px)',
              zIndex: 10,
            }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                  <SectionHeader 
                    title="인 물" 
                    subtitle="Members" 
                    color={accentColor} 
                  />

                  {characters.length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px',
                      }}>
                          {characters.map((char, i) => (
                              <CharacterCard 
                                  key={char.id} 
                                  character={char} 
                                  faction={faction}
                                  isLeader={char.id === faction.leader}
                                  index={i}
                                  onClick={() => {
                                    playClick();
                                    setSelectedCharacter(char);
                                  }}
                                  onHover={playHover}
                              />
                          ))}
                      </div>
                  ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{
                          textAlign: 'center',
                          padding: 'clamp(50px, 10vh, 100px)',
                          background: 'rgba(0,0,0,0.4)',
                          border: `1px solid ${accentColor}15`,
                        }}
                      >
                          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', marginBottom: '8px' }}>
                            기록된 인물이 없습니다
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
                            강호의 기록이 아직 도달하지 않았습니다
                          </p>
                      </motion.div>
                  )}

                  {/* 전체 인물 보기 버튼 */}
                  {characters.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      style={{ textAlign: 'center', marginTop: 'clamp(40px, 8vh, 80px)' }}
                    >
                        <Link href={`/characters?faction=${faction.id}`}>
                            <motion.button
                                onClick={playClick}
                                onMouseEnter={playHover}
                                style={{ 
                                  padding: '15px 40px',
                                  border: `1px solid ${accentColor}40`,
                                  background: 'transparent',
                                  color: 'rgba(255,255,255,0.6)',
                                  fontSize: '13px',
                                  letterSpacing: '0.2em',
                                  cursor: 'pointer',
                                  fontFamily: '"Nanum Myeongjo", serif',
                                }}
                                whileHover={{ 
                                  background: `${accentColor}15`,
                                  borderColor: accentColor,
                                  color: '#fff',
                                }}
                            >
                                전체 인물 →
                            </motion.button>
                        </Link>
                    </motion.div>
                  )}
              </div>
            </section>

            {/* ============================================ */}
            {/* 세력 관계 섹션 - 무협소설 스타일 관계도 */}
            {/* ============================================ */}
            {faction.relations && faction.relations.length > 0 && (
                <section style={{
                  position: 'relative',
                  padding: 'clamp(60px, 15vh, 150px) clamp(20px, 5vw, 60px)',
                  zIndex: 10,
                }}>
                  <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                      <SectionHeader 
                        title="세력 관계도" 
                        subtitle="江湖關係" 
                        color={accentColor} 
                      />

                      {/* 관계 유형 범례 - 그룹별 분류 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          marginBottom: 'clamp(30px, 5vh, 50px)',
                          padding: '20px',
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        {/* 우호적 관계 그룹 */}
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#34d399',
                            marginBottom: '10px',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <div style={{ width: '20px', height: '2px', background: 'linear-gradient(90deg, #fbbf24, #34d399)' }} />
                            우호적 관계
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                              { type: '혈맹', color: '#fbbf24', icon: '🔥', desc: '피로 맺은 맹약' },
                              { type: '동맹', color: '#60a5fa', icon: '🤝', desc: '정식 동맹' },
                              { type: '사제', color: '#fcd34d', icon: '📖', desc: '사제 관계' },
                              { type: '우호', color: '#34d399', icon: '💚', desc: '우호 관계' },
                              { type: '협력', color: '#a78bfa', icon: '⚔️', desc: '임시 협력' },
                              { type: '혼인', color: '#f472b6', icon: '💒', desc: '정략 혼인' },
                              { type: '보호', color: '#22d3ee', icon: '🛡️', desc: '보호 관계' },
                            ].map((legend) => (
                              <div 
                                key={legend.type}
                                title={legend.desc}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  background: `${legend.color}15`,
                                  border: `1px solid ${legend.color}40`,
                                  borderRadius: '20px',
                                  cursor: 'help',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `${legend.color}30`;
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = `${legend.color}15`;
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                <span style={{ fontSize: '14px' }}>{legend.icon}</span>
                                <span style={{ color: legend.color, fontWeight: 600, fontSize: '12px' }}>{legend.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 중립적 관계 그룹 */}
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#9ca3af',
                            marginBottom: '10px',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <div style={{ width: '20px', height: '2px', background: 'linear-gradient(90deg, #6b7280, #9ca3af)' }} />
                            중립적 관계
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                              { type: '중립', color: '#9ca3af', icon: '⚖️', desc: '중립 관계' },
                              { type: '밀약', color: '#6b7280', icon: '🌑', desc: '비밀 협정' },
                              { type: '종속', color: '#78716c', icon: '⛓️', desc: '종속 관계' },
                              { type: '경쟁', color: '#fb923c', icon: '🏆', desc: '라이벌 경쟁' },
                            ].map((legend) => (
                              <div 
                                key={legend.type}
                                title={legend.desc}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  background: `${legend.color}15`,
                                  border: `1px solid ${legend.color}40`,
                                  borderRadius: '20px',
                                  cursor: 'help',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `${legend.color}30`;
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = `${legend.color}15`;
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                <span style={{ fontSize: '14px' }}>{legend.icon}</span>
                                <span style={{ color: legend.color, fontWeight: 600, fontSize: '12px' }}>{legend.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 적대적 관계 그룹 */}
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#ef4444',
                            marginBottom: '10px',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <div style={{ width: '20px', height: '2px', background: 'linear-gradient(90deg, #f87171, #dc2626)' }} />
                            적대적 관계
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                              { type: '암투', color: '#7c3aed', icon: '🗡️', desc: '암중 대립' },
                              { type: '원한', color: '#ef4444', icon: '💔', desc: '과거 원한' },
                              { type: '적대', color: '#f87171', icon: '⚡', desc: '적대 관계' },
                              { type: '숙적', color: '#dc2626', icon: '☠️', desc: '불구대천 원수' },
                            ].map((legend) => (
                              <div 
                                key={legend.type}
                                title={legend.desc}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  background: `${legend.color}15`,
                                  border: `1px solid ${legend.color}40`,
                                  borderRadius: '20px',
                                  cursor: 'help',
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = `${legend.color}30`;
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = `${legend.color}15`;
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                <span style={{ fontSize: '14px' }}>{legend.icon}</span>
                                <span style={{ color: legend.color, fontWeight: 600, fontSize: '12px' }}>{legend.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* 관계 카드 그리드 */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '16px' 
                      }}>
                          {faction.relations.map((rel, i) => {
                              const targetFaction = getFactionById(rel.targetId);
                              const targetName = targetFaction 
                                  ? targetFaction.name.split('(')[0].trim() 
                                  : (FACTION_NAME_MAP[rel.targetId] || rel.targetId);
                              
                              // 관계 타입별 색상 및 아이콘
                              const getRelationStyle = (type: string) => {
                                switch(type) {
                                  case '혈맹': return { color: '#fbbf24', icon: '🔥', bgGlow: 'rgba(251,191,36,0.15)' };
                                  case '동맹': return { color: '#60a5fa', icon: '🤝', bgGlow: 'rgba(96,165,250,0.15)' };
                                  case '우호': return { color: '#34d399', icon: '💚', bgGlow: 'rgba(52,211,153,0.15)' };
                                  case '협력': return { color: '#a78bfa', icon: '⚔️', bgGlow: 'rgba(167,139,250,0.15)' };
                                  case '혼인': return { color: '#f472b6', icon: '💒', bgGlow: 'rgba(244,114,182,0.15)' };
                                  case '사제': return { color: '#fcd34d', icon: '📖', bgGlow: 'rgba(252,211,77,0.15)' };
                                  case '밀약': return { color: '#6b7280', icon: '🌑', bgGlow: 'rgba(107,114,128,0.15)' };
                                  case '중립': return { color: '#9ca3af', icon: '⚖️', bgGlow: 'rgba(156,163,175,0.15)' };
                                  case '경쟁': return { color: '#fb923c', icon: '🏆', bgGlow: 'rgba(251,146,60,0.15)' };
                                  case '암투': return { color: '#7c3aed', icon: '🗡️', bgGlow: 'rgba(124,58,237,0.15)' };
                                  case '원한': return { color: '#ef4444', icon: '💔', bgGlow: 'rgba(239,68,68,0.15)' };
                                  case '적대': return { color: '#f87171', icon: '⚡', bgGlow: 'rgba(248,113,113,0.15)' };
                                  case '숙적': return { color: '#dc2626', icon: '☠️', bgGlow: 'rgba(220,38,38,0.2)' };
                                  case '종속': return { color: '#78716c', icon: '⛓️', bgGlow: 'rgba(120,113,108,0.15)' };
                                  case '보호': return { color: '#22d3ee', icon: '🛡️', bgGlow: 'rgba(34,211,238,0.15)' };
                                  default: return { color: '#9ca3af', icon: '•', bgGlow: 'rgba(156,163,175,0.1)' };
                                }
                              };
                              
                              const relStyle = getRelationStyle(rel.type);
                              const intensityBorder = rel.intensity === 'strong' ? '3px' : rel.intensity === 'weak' ? '1px' : '2px';
                                  
                              return (
                                  <motion.div
                                      key={i}
                                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                      whileHover={{ 
                                        scale: 1.02, 
                                        boxShadow: `0 8px 30px ${relStyle.bgGlow}`,
                                      }}
                                      transition={{ delay: i * 0.05, duration: 0.3 }}
                                      viewport={{ once: true }}
                                      style={{
                                        position: 'relative',
                                        padding: '20px',
                                        background: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, ${relStyle.bgGlow} 100%)`,
                                        borderLeft: `${intensityBorder} solid ${relStyle.color}`,
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                      }}
                                  >
                                      {/* 배경 장식 */}
                                      <div style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        right: '-20px',
                                        fontSize: '80px',
                                        opacity: 0.05,
                                        pointerEvents: 'none',
                                      }}>
                                        {relStyle.icon}
                                      </div>

                                      {/* 상단: 관계 유형 + 강도 */}
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px',
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <span style={{ fontSize: '18px' }}>{relStyle.icon}</span>
                                          <span style={{
                                            padding: '5px 12px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            letterSpacing: '0.1em',
                                            background: `${relStyle.color}20`,
                                            color: relStyle.color,
                                            borderRadius: '2px',
                                          }}>
                                              {rel.type}
                                          </span>
                                        </div>
                                        {rel.intensity && (
                                          <span style={{
                                            fontSize: '10px',
                                            color: 'rgba(255,255,255,0.4)',
                                            padding: '3px 8px',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '2px',
                                          }}>
                                            {rel.intensity === 'strong' ? '강함' : rel.intensity === 'weak' ? '약함' : '보통'}
                                          </span>
                                        )}
                                      </div>

                                      {/* 대상 문파명 */}
                                      <Link 
                                          href={`/factions/${rel.targetId}`}
                                          style={{
                                            display: 'block',
                                            fontSize: '18px',
                                            fontWeight: 500,
                                            color: 'rgba(255,255,255,0.95)',
                                            textDecoration: 'none',
                                            marginBottom: '8px',
                                          }}
                                          onMouseEnter={playHover}
                                          onClick={playClick}
                                      >
                                          {targetName}
                                          {targetFaction && (
                                            <span style={{ 
                                              marginLeft: '8px', 
                                              fontSize: '14px', 
                                              color: 'rgba(255,255,255,0.4)',
                                              fontWeight: 300,
                                            }}>
                                              {targetFaction.hanja}
                                            </span>
                                          )}
                                      </Link>

                                      {/* 관계 설명 */}
                                      <p style={{
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.6)',
                                        lineHeight: 1.6,
                                        marginBottom: rel.history || rel.since ? '12px' : 0,
                                      }}>
                                        {rel.description}
                                      </p>

                                      {/* 추가 정보 (역사/시작 시점) */}
                                      {(rel.history || rel.since) && (
                                        <div style={{
                                          paddingTop: '12px',
                                          borderTop: '1px solid rgba(255,255,255,0.1)',
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: '12px',
                                        }}>
                                          {rel.since && (
                                            <span style={{
                                              fontSize: '11px',
                                              color: 'rgba(255,255,255,0.4)',
                                            }}>
                                              ⏳ {rel.since}부터
                                            </span>
                                          )}
                                          {rel.history && (
                                            <span style={{
                                              fontSize: '11px',
                                              color: 'rgba(255,255,255,0.35)',
                                              fontStyle: 'italic',
                                            }}>
                                              📜 {rel.history}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                  </motion.div>
                              );
                          })}
                      </div>

                      {/* 관계 요약 통계 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        style={{
                          marginTop: 'clamp(30px, 5vh, 50px)',
                          padding: '20px',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '4px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          gap: '30px',
                        }}
                      >
                        {(() => {
                          const friendlyTypes = ['혈맹', '동맹', '우호', '협력', '혼인', '사제', '보호'];
                          const hostileTypes = ['숙적', '적대', '원한', '암투', '경쟁'];
                          const neutralTypes = ['중립', '밀약', '종속'];
                          
                          const friendly = faction.relations.filter(r => friendlyTypes.includes(r.type)).length;
                          const hostile = faction.relations.filter(r => hostileTypes.includes(r.type)).length;
                          const neutral = faction.relations.filter(r => neutralTypes.includes(r.type)).length;
                          
                          return (
                            <>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 600, color: '#60a5fa' }}>{friendly}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>우방 세력</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 600, color: '#f87171' }}>{hostile}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>적대 세력</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 600, color: '#9ca3af' }}>{neutral}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>기타 관계</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 600, color: accentColor }}>{faction.relations.length}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>총 관계</div>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                  </div>
                </section>
            )}

            {/* ============================================ */}
            {/* 거점 섹션 */}
            {/* ============================================ */}
            {faction.locations && faction.locations.length > 0 && (
                <section style={{
                  position: 'relative',
                  padding: 'clamp(60px, 15vh, 150px) clamp(20px, 5vw, 60px)',
                  zIndex: 10,
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <SectionHeader 
                          title="거 점" 
                          subtitle="Locations" 
                          color={accentColor} 
                        />

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '20px',
                        }}>
                            {faction.locations.map((loc, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    style={{
                                      padding: 'clamp(20px, 4vh, 35px)',
                                      background: 'rgba(0,0,0,0.4)',
                                      border: `1px solid ${accentColor}15`,
                                      position: 'relative',
                                    }}
                                >
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-between',
                                      marginBottom: '15px',
                                    }}>
                                        <h3 style={{
                                          fontSize: 'clamp(18px, 3vw, 22px)',
                                          fontWeight: 300,
                                          color: '#fff',
                                        }}>
                                          {loc.name}
                                        </h3>
                                        <span style={{
                                          fontSize: '9px',
                                          padding: '4px 10px',
                                          letterSpacing: '0.1em',
                                          background: `${accentColor}15`,
                                          color: accentColor,
                                        }}>
                                            {loc.type}
                                        </span>
                                    </div>
                                    <p style={{
                                      fontSize: 'clamp(16px, 2.5vw, 20px)',
                                      letterSpacing: '0.25em',
                                      color: `${accentColor}70`,
                                    }}>
                                      {loc.hanja}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* 갤러리 섹션 - 캐릭터 이미지 */}
            {/* ============================================ */}
            <section style={{
              position: 'relative',
              padding: 'clamp(60px, 15vh, 150px) clamp(20px, 5vw, 60px)',
              zIndex: 10,
            }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                  <SectionHeader 
                    title="화 첩" 
                    subtitle="Gallery" 
                    color={accentColor} 
                  />

                  {characters.length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px',
                      }}>
                          {characters.filter(c => c.image).map((char, i) => (
                              <motion.div
                                  key={char.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.08 }}
                                  viewport={{ once: true }}
                                  onClick={() => {
                                    playClick();
                                    setGalleryCharacter(char);
                                  }}
                                  onMouseEnter={playHover}
                                  style={{
                                    position: 'relative',
                                    aspectRatio: '3/4',
                                    overflow: 'hidden',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: `1px solid ${accentColor}15`,
                                    cursor: 'pointer',
                                  }}
                                  whileHover={{ scale: 1.02, borderColor: `${accentColor}40` }}
                              >
                                  <img 
                                    src={char.image} 
                                    alt={char.name}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  {/* 캐릭터 정보 오버레이 */}
                                  <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '40px 15px 15px',
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                                  }}>
                                      <p style={{
                                        fontSize: '10px',
                                        color: accentColor,
                                        letterSpacing: '0.15em',
                                        marginBottom: '4px',
                                      }}>
                                        {char.title}
                                      </p>
                                      <h4 style={{
                                        fontSize: 'clamp(16px, 2.5vw, 20px)',
                                        fontWeight: 400,
                                        color: '#fff',
                                        margin: 0,
                                      }}>
                                        {char.name}
                                      </h4>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  ) : (
                       <motion.div 
                         initial={{ opacity: 0 }}
                         whileInView={{ opacity: 1 }}
                         viewport={{ once: true }}
                         style={{
                           textAlign: 'center',
                           padding: 'clamp(50px, 10vh, 100px)',
                           background: 'rgba(0,0,0,0.4)',
                           border: `1px solid ${accentColor}15`,
                         }}
                       >
                          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px', marginBottom: '8px' }}>
                            등록된 화첩이 없습니다
                          </p>
                          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
                            아직 기록이 도달하지 않았습니다
                          </p>
                      </motion.div>
                  )}
              </div>
            </section>

            {/* ============================================ */}
            {/* 푸터 */}
            {/* ============================================ */}
            <footer style={{
              position: 'relative',
              padding: 'clamp(60px, 12vh, 120px) clamp(20px, 5vw, 60px)',
              zIndex: 10,
            }}>
                <div style={{
                  maxWidth: '700px',
                  margin: '0 auto',
                  textAlign: 'center',
                }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* 인용문 */}
                        <blockquote style={{
                          fontSize: 'clamp(15px, 2.5vw, 20px)',
                          fontStyle: 'italic',
                          color: 'rgba(255,255,255,0.4)',
                          marginBottom: 'clamp(40px, 8vh, 60px)',
                          lineHeight: 1.8,
                        }}>
                            「 {faction.desc.split('.')[0]}. 」
                        </blockquote>

                        {/* 장식 문양 */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '20px',
                          marginBottom: 'clamp(40px, 8vh, 60px)',
                        }}>
                          <div style={{
                            width: '40px',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${accentColor}40)`,
                          }} />
                          <div style={{
                            width: '6px',
                            height: '6px',
                            border: `1px solid ${accentColor}50`,
                            transform: 'rotate(45deg)',
                          }} />
                          <div style={{
                            width: '40px',
                            height: '1px',
                            background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
                          }} />
                        </div>

                        {/* 네비게이션 */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 'clamp(40px, 10vw, 80px)',
                        }}>
                            <Link href="/" style={{ textDecoration: 'none' }} onClick={playClick} onMouseEnter={playHover}>
                                <motion.span 
                                  style={{
                                    fontSize: '13px',
                                    color: 'rgba(255,255,255,0.35)',
                                    letterSpacing: '0.15em',
                                    cursor: 'pointer',
                                  }}
                                  whileHover={{ color: '#fff', x: -5 }}
                                >
                                  ← 메인
                                </motion.span>
                            </Link>
                            <Link href="/characters" style={{ textDecoration: 'none' }} onClick={playClick} onMouseEnter={playHover}>
                                <motion.span 
                                  style={{
                                    fontSize: '13px',
                                    color: 'rgba(255,255,255,0.35)',
                                    letterSpacing: '0.15em',
                                    cursor: 'pointer',
                                  }}
                                  whileHover={{ color: '#fff', x: 5 }}
                                >
                                  인물록 →
                                </motion.span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </footer>

            {/* 캐릭터 상세 모달 */}
            <AnimatePresence>
              {selectedCharacter && (
                <CharacterDetailModal
                  character={selectedCharacter}
                  faction={faction}
                  onClose={() => setSelectedCharacter(null)}
                />
              )}
            </AnimatePresence>

            {/* 이미지 갤러리 뷰어 (화첩용) */}
            <AnimatePresence>
              {galleryCharacter && (
                <ImageGalleryViewer
                  character={galleryCharacter}
                  accentColor={accentColor}
                  onClose={() => setGalleryCharacter(null)}
                />
              )}
            </AnimatePresence>
        </div>
    );
}

// ============================================
// 캐릭터 카드 컴포넌트 - 정통 무협 스타일
// ============================================
function CharacterCard({ 
    character, 
    faction,
    isLeader,
    index,
    onClick,
    onHover
}: { 
    character: Character;
    faction: Faction;
    isLeader: boolean;
    index: number;
    onClick?: () => void;
    onHover?: () => void;
}) {
    const accentColor = faction.colors.accent;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            viewport={{ once: true }}
            onClick={onClick}
            onMouseEnter={onHover}
            whileHover={{ 
              scale: 1.02, 
              borderColor: `${accentColor}40`,
              boxShadow: `0 10px 40px rgba(0,0,0,0.4), 0 0 20px ${accentColor}15`
            }}
            style={{
              position: 'relative',
              padding: 'clamp(20px, 4vh, 30px)',
              background: 'linear-gradient(160deg, rgba(0,0,0,0.5) 0%, rgba(20,18,15,0.3) 100%)',
              border: `1px solid ${accentColor}15`,
              cursor: 'pointer',
            }}
        >
            {/* 리더 배지 */}
            {isLeader && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.06 + 0.3, type: 'spring' }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      padding: '5px 12px',
                      background: accentColor,
                      color: '#000',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      letterSpacing: '0.1em',
                    }}
                >
                    首長
                </motion.div>
            )}

            {/* 상단 경지 정보 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px',
            }}>
                <span style={{
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: `${REALM_COLORS[character.realm]}30`,
                  border: `1px solid ${REALM_COLORS[character.realm]}60`,
                  color: REALM_COLORS[character.realm],
                  borderRadius: '100px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}>
                    {character.realm}
                </span>
            </div>

            {/* 이름 & 직책 */}
            <h3 style={{
              fontSize: 'clamp(18px, 3vw, 22px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '6px',
            }}>
                {character.name}
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '13px',
              marginBottom: '4px',
            }}>
              {character.title}
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '11px',
              letterSpacing: '0.1em',
            }}>
              {character.position}
            </p>

            {/* 스탯 바 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginTop: '20px',
            }}>
                <StatMini label="武" value={character.stats.martial} color="#ef4444" />
                <StatMini label="內" value={character.stats.internal} color="#3b82f6" />
                <StatMini label="輕" value={character.stats.agility} color="#22c55e" />
                <StatMini label="智" value={character.stats.intelligence} color="#f59e0b" />
            </div>

            {/* 대표 무공 */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '16px',
            }}>
                {character.skills.slice(0, 2).map((skill, i) => (
                    <span 
                      key={i} 
                      style={{
                        fontSize: '10px',
                        padding: '5px 10px',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.05em',
                      }}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

// ============================================
// 미니 스탯 바 - 한자 라벨
// ============================================
function StatMini({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '6px',
              letterSpacing: '0.1em',
            }}>
              {label}
            </div>
            <div style={{
              height: '3px',
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
              borderRadius: '2px',
            }}>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                    style={{
                      height: '100%',
                      background: color,
                      borderRadius: '2px',
                    }}
                />
            </div>
        </div>
    );
}

// ============================================
// 캐릭터 상세 모달 - 갤러리 포함
// ============================================
function CharacterDetailModal({ 
  character, 
  faction,
  onClose 
}: { 
  character: Character;
  faction: Faction;
  onClose: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const { playHover, playClick } = useAudio();

  // 확대 이미지 드래그 상태
  const [imageDrag, setImageDrag] = useState({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  // 갤러리 이미지 배열 생성 (gallery가 있으면 gallery만 사용, 없으면 image 사용)
  const galleryImages = useMemo(() => {
    if (character.gallery && character.gallery.length > 0) {
      return character.gallery;
    }
    return character.image ? [character.image] : [];
  }, [character.image, character.gallery]);

  const accentColor = faction.colors.accent;
  const realmColor = REALM_COLORS[character.realm] || '#9ca3af';

  // 이미지 변경 시 드래그 위치 리셋
  useEffect(() => {
    setImageDrag(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
  }, [selectedImageIndex]);

  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
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
        padding: '20px',
        overscrollBehavior: 'contain',
        touchAction: 'none'
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* 백드롭 */}
      <motion.div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <motion.div
        initial={{ scale: 0.9, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          background: 'linear-gradient(180deg, #151210 0%, #0a0908 100%)',
          border: `1px solid ${accentColor}30`,
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={() => { playClick(); onClose(); }}
          onMouseEnter={playHover}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            border: `1px solid ${accentColor}30`,
            borderRadius: '50%',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            fontSize: '1.4rem',
            zIndex: 10
          }}
        >
          ×
        </button>

        {/* 스크롤 영역 */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y'
          }}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* 상단 장식 */}
          <div style={{
            height: '4px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }} />

          {/* 갤러리 영역 */}
          {galleryImages.length > 0 && !imageError && (
            <div style={{
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)',
              borderBottom: `1px solid ${accentColor}20`
            }}>
              {/* 메인 이미지 */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '3/4',
                  maxHeight: '400px',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setIsImageExpanded(true)}
              >
                <img
                  src={galleryImages[selectedImageIndex]}
                  alt={character.name}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                  onError={() => setImageError(true)}
                />
                {/* 현재 표정 라벨 */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  padding: '6px 12px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🎭 {selectedImageIndex < EXPRESSION_LABELS.length ? EXPRESSION_LABELS[selectedImageIndex] : `이미지 ${selectedImageIndex + 1}`}
                </div>
              </div>

              {/* 썸네일 네비게이션 */}
              {galleryImages.length > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.5)'
                }}>
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { playClick(); setSelectedImageIndex(idx); }}
                      onMouseEnter={playHover}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        border: selectedImageIndex === idx 
                          ? `2px solid ${accentColor}` 
                          : `1px solid ${accentColor}30`,
                        padding: 0,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        opacity: selectedImageIndex === idx ? 1 : 0.5,
                        transition: 'all 0.2s'
                      }}
                    >
                      <img
                        src={img}
                        alt={`${character.name} ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 헤더 정보 */}
          <div style={{
            padding: 'clamp(20px, 4vh, 32px) clamp(20px, 4vw, 32px)',
            borderBottom: `1px solid ${accentColor}15`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px',
                background: `${realmColor}20`,
                border: `1px solid ${realmColor}50`,
                borderRadius: '4px',
                color: realmColor,
                fontSize: '12px',
                fontWeight: 500
              }}>
                {character.realm}
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '13px'
              }}>
                {character.position}
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              fontFamily: '"Nanum Myeongjo", serif',
              color: '#fff',
              margin: 0,
              marginBottom: '6px',
              letterSpacing: '0.05em'
            }}>
              {character.name}
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: accentColor,
              margin: 0,
              fontFamily: '"Nanum Myeongjo", serif'
            }}>
              {character.title}
            </p>
          </div>

          {/* 컨텐츠 영역 */}
          <div style={{ padding: 'clamp(20px, 4vh, 32px) clamp(20px, 4vw, 32px)' }}>
            {/* 스탯 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '28px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: `1px solid ${accentColor}15`,
              borderRadius: '4px'
            }}>
              <ModalStatDisplay label="무공" hanja="武" value={character.stats.martial} color="#ef4444" />
              <ModalStatDisplay label="내공" hanja="內" value={character.stats.internal} color="#3b82f6" />
              <ModalStatDisplay label="경공" hanja="輕" value={character.stats.agility} color="#22c55e" />
              <ModalStatDisplay label="지력" hanja="智" value={character.stats.intelligence} color="#f59e0b" />
            </div>

            {/* 외형 */}
            <ModalInfoSection title="외형" hanja="容" accentColor={accentColor}>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.9, margin: 0, fontSize: '14px' }}>
                {character.appearance}
              </p>
            </ModalInfoSection>

            {/* 서사 */}
            <ModalInfoSection title="서사" hanja="史" accentColor={accentColor}>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.9, margin: 0, fontSize: '14px' }}>
                {character.story}
              </p>
            </ModalInfoSection>

            {/* 전투 스타일 */}
            <ModalInfoSection title="전투" hanja="鬪" accentColor={accentColor}>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.9, margin: 0, fontSize: '14px' }}>
                {character.combatStyle}
              </p>
            </ModalInfoSection>

            {/* 무공 */}
            <ModalInfoSection title="무공" hanja="功" accentColor={accentColor}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {character.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '8px 14px',
                      background: `${accentColor}10`,
                      border: `1px solid ${accentColor}30`,
                      borderRadius: '4px',
                      color: accentColor,
                      fontSize: '13px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ModalInfoSection>

            {/* 하단 장식 */}
            <div style={{
              height: '3px',
              marginTop: '24px',
              background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`
            }} />
          </div>
        </div>
      </motion.div>

      {/* 이미지 확대 뷰 */}
      <AnimatePresence>
        {isImageExpanded && galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.95)',
              cursor: 'zoom-out',
              overscrollBehavior: 'contain',
              touchAction: 'none'
            }}
            onClick={() => setIsImageExpanded(false)}
            onWheel={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => { playClick(); setIsImageExpanded(false); }}
              onMouseEnter={playHover}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.6)',
                border: `1px solid ${accentColor}40`,
                borderRadius: '50%',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.6rem',
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* 이전 버튼 */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  setSelectedImageIndex(prev => 
                    prev === 0 ? galleryImages.length - 1 : prev - 1
                  );
                }}
                onMouseEnter={playHover}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: `1px solid ${accentColor}40`,
                  borderRadius: '50%',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                  zIndex: 10
                }}
              >
                ‹
              </button>
            )}

            {/* 확대 이미지 - 드래그 가능 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: imageDrag.offsetX, y: imageDrag.offsetY }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ x: { duration: 0 }, y: { duration: 0 } }}
              style={{
                position: 'relative',
                width: '90vw',
                height: '90vh',
                maxWidth: '800px',
                cursor: imageDrag.isDragging ? 'grabbing' : 'grab'
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                e.preventDefault();
                setImageDrag(prev => ({
                  ...prev,
                  isDragging: true,
                  startX: e.clientX - prev.offsetX,
                  startY: e.clientY - prev.offsetY
                }));
              }}
              onMouseMove={(e) => {
                if (imageDrag.isDragging) {
                  setImageDrag(prev => ({
                    ...prev,
                    offsetX: e.clientX - prev.startX,
                    offsetY: e.clientY - prev.startY
                  }));
                }
              }}
              onMouseUp={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
              onMouseLeave={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setImageDrag(prev => ({
                  ...prev,
                  isDragging: true,
                  startX: touch.clientX - prev.offsetX,
                  startY: touch.clientY - prev.offsetY
                }));
              }}
              onTouchMove={(e) => {
                if (imageDrag.isDragging) {
                  const touch = e.touches[0];
                  setImageDrag(prev => ({
                    ...prev,
                    offsetX: touch.clientX - prev.startX,
                    offsetY: touch.clientY - prev.startY
                  }));
                }
              }}
              onTouchEnd={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
            >
              <img
                src={galleryImages[selectedImageIndex]}
                alt={character.name}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none'
                }}
                draggable={false}
              />
            </motion.div>

            {/* 다음 버튼 */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  setSelectedImageIndex(prev => 
                    prev === galleryImages.length - 1 ? 0 : prev + 1
                  );
                }}
                onMouseEnter={playHover}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: `1px solid ${accentColor}40`,
                  borderRadius: '50%',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                  zIndex: 10
                }}
              >
                ›
              </button>
            )}

            {/* 이미지 카운터 및 표정 라벨 - 무협 스타일 */}
            {galleryImages.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* 표정 이름 - 두루마리 스타일 */}
                <div style={{
                  position: 'relative',
                  padding: '16px 40px',
                  background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.95) 0%, rgba(13, 9, 6, 0.98) 100%)',
                  border: `2px solid ${accentColor}80`,
                  borderRadius: '4px',
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px ${accentColor}20`,
                }}>
                  {/* 상단 장식 */}
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
                  }} />
                  {/* 하단 장식 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
                  }} />
                  <div style={{
                    fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                    fontFamily: '"Nanum Myeongjo", serif',
                    fontWeight: 700,
                    color: '#fff',
                    textShadow: `0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px ${accentColor}40`,
                    letterSpacing: '0.15em',
                    textAlign: 'center'
                  }}>
                    {selectedImageIndex < EXPRESSION_LABELS.length 
                      ? EXPRESSION_LABELS[selectedImageIndex] 
                      : `제 ${selectedImageIndex + 1} 식`}
                  </div>
                </div>
                {/* 이미지 카운터 */}
                <div style={{
                  padding: '8px 20px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: `1px solid ${accentColor}40`,
                  borderRadius: '4px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.1em'
                }}>
                  {selectedImageIndex + 1} / {galleryImages.length}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 모달용 스탯 디스플레이
function ModalStatDisplay({ label, hanja, value, color }: { label: string; hanja: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.1rem', color: color }}>{hanja}</span>
        <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>{label}</span>
      </div>
      <div style={{
        height: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '6px'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            height: '100%',
            background: color,
            borderRadius: '2px'
          }}
        />
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: color }}>{value}</div>
    </div>
  );
}

// 모달용 정보 섹션
function ModalInfoSection({ title, hanja, accentColor, children }: { title: string; hanja: string; accentColor: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '1rem',
        fontFamily: '"Nanum Myeongjo", serif',
        color: '#fff',
        marginBottom: '12px'
      }}>
        <span style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
          borderRadius: '4px',
          color: accentColor,
          fontSize: '0.9rem'
        }}>
          {hanja}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ============================================
// 이미지 갤러리 뷰어 (화첩용) - 이미지만 보여주는 심플 뷰어
// ============================================
function ImageGalleryViewer({ 
  character, 
  accentColor,
  onClose 
}: { 
  character: Character;
  accentColor: string;
  onClose: () => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dragScroll = useDragScroll();
  const { playHover, playClick } = useAudio();

  // 이미지 드래그 상태
  const [imageDrag, setImageDrag] = useState({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  // 갤러리 이미지 배열 생성 (gallery가 있으면 gallery만 사용, 없으면 image 사용)
  const galleryImages = useMemo(() => {
    if (character.gallery && character.gallery.length > 0) {
      return character.gallery;
    }
    return character.image ? [character.image] : [];
  }, [character.image, character.gallery]);

  // 이미지 변경 시 드래그 위치 리셋
  useEffect(() => {
    setImageDrag(prev => ({ ...prev, offsetX: 0, offsetY: 0 }));
  }, [selectedIndex]);

  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setSelectedIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1);
      }
      if (e.key === 'ArrowRight') {
        setSelectedIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryImages.length, onClose]);

  if (galleryImages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.95)',
        overscrollBehavior: 'contain',
        touchAction: 'none'
      }}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* 상단 정보 바 */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          zIndex: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
            fontFamily: '"Nanum Myeongjo", serif',
            color: '#fff',
            margin: 0,
            marginBottom: '4px'
          }}>
            {character.name}
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: accentColor,
            margin: 0
          }}>
            {character.title}
          </p>
        </div>
        
        {/* 닫기 버튼 */}
        <button
          onClick={() => { playClick(); onClose(); }}
          onMouseEnter={playHover}
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${accentColor}40`,
            borderRadius: '50%',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          ×
        </button>
      </div>

      {/* 메인 이미지 - 드래그 가능 */}
      <motion.div
        key={selectedIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, x: imageDrag.offsetX, y: imageDrag.offsetY }}
        transition={{ duration: 0.2, x: { duration: 0 }, y: { duration: 0 } }}
        style={{
          position: 'relative',
          width: '90vw',
          height: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          cursor: imageDrag.isDragging ? 'grabbing' : 'grab'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          e.preventDefault();
          setImageDrag(prev => ({
            ...prev,
            isDragging: true,
            startX: e.clientX - prev.offsetX,
            startY: e.clientY - prev.offsetY
          }));
        }}
        onMouseMove={(e) => {
          if (imageDrag.isDragging) {
            setImageDrag(prev => ({
              ...prev,
              offsetX: e.clientX - prev.startX,
              offsetY: e.clientY - prev.startY
            }));
          }
        }}
        onMouseUp={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
        onMouseLeave={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          setImageDrag(prev => ({
            ...prev,
            isDragging: true,
            startX: touch.clientX - prev.offsetX,
            startY: touch.clientY - prev.offsetY
          }));
        }}
        onTouchMove={(e) => {
          if (imageDrag.isDragging) {
            const touch = e.touches[0];
            setImageDrag(prev => ({
              ...prev,
              offsetX: touch.clientX - prev.startX,
              offsetY: touch.clientY - prev.startY
            }));
          }
        }}
        onTouchEnd={() => setImageDrag(prev => ({ ...prev, isDragging: false }))}
      >
        <img
          src={galleryImages[selectedIndex]}
          alt={`${character.name} ${selectedIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100% - 40px)',
            objectFit: 'contain',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
        {/* 표정 라벨 - 무협 스타일 */}
        <div style={{
          position: 'relative',
          padding: '16px 40px',
          background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.95) 0%, rgba(13, 9, 6, 0.98) 100%)',
          border: `2px solid ${accentColor}80`,
          borderRadius: '4px',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px ${accentColor}20`,
        }}>
          {/* 상단 장식 */}
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
          }} />
          {/* 하단 장식 */}
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
          }} />
          <div style={{
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            fontFamily: '"Nanum Myeongjo", serif',
            fontWeight: 700,
            color: '#fff',
            textShadow: `0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px ${accentColor}40`,
            letterSpacing: '0.15em',
            textAlign: 'center'
          }}>
            {selectedIndex < EXPRESSION_LABELS.length 
              ? EXPRESSION_LABELS[selectedIndex] 
              : `제 ${selectedIndex + 1} 식`}
          </div>
        </div>
      </motion.div>

      {/* 이전 버튼 */}
      {galleryImages.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClick();
            setSelectedIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1);
          }}
          onMouseEnter={playHover}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            border: `1px solid ${accentColor}40`,
            borderRadius: '50%',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.4rem',
            zIndex: 10
          }}
        >
          ‹
        </button>
      )}

      {/* 다음 버튼 */}
      {galleryImages.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClick();
            setSelectedIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1);
          }}
          onMouseEnter={playHover}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            border: `1px solid ${accentColor}40`,
            borderRadius: '50%',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.4rem',
            zIndex: 10
          }}
        >
          ›
        </button>
      )}

      {/* 하단 썸네일 & 카운터 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 썸네일 - 드래그 스크롤 */}
        {galleryImages.length > 1 && (
          <div 
            ref={dragScroll.ref}
            {...dragScroll.handlers}
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-start',
              overflowX: 'auto',
              maxWidth: '90vw',
              padding: '8px 0',
              scrollbarWidth: 'thin',
              scrollbarColor: `${accentColor}60 transparent`,
              cursor: 'grab',
              userSelect: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => { if (!dragScroll.isDragging) { playClick(); setSelectedIndex(idx); } }}
                onMouseEnter={() => { if (!dragScroll.isDragging) playHover(); }}
                style={{
                  minWidth: '60px',
                  width: '60px',
                  height: '80px',
                  borderRadius: '4px',
                  border: selectedIndex === idx 
                    ? `2px solid ${accentColor}` 
                    : '2px solid rgba(255,255,255,0.2)',
                  padding: 0,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  opacity: selectedIndex === idx ? 1 : 0.6,
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(0,0,0,0.5)'
                }}
              >
                <img
                  src={img}
                  alt={`썸네일 ${idx + 1}`}
                  style={{ width: '100%', height: '50px', objectFit: 'cover', pointerEvents: 'none' }}
                />
                <span style={{
                  fontSize: '9px',
                  color: selectedIndex === idx ? accentColor : 'rgba(255,255,255,0.7)',
                  padding: '2px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {idx < EXPRESSION_LABELS.length ? EXPRESSION_LABELS[idx] : `${idx + 1}`}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 이미지 카운터 */}
        <div style={{
          padding: '6px 16px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '20px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '13px',
          fontFamily: '"Nanum Myeongjo", serif'
        }}>
          {selectedIndex + 1} / {galleryImages.length}
        </div>
      </div>
    </motion.div>
  );
}
