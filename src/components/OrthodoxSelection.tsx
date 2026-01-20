"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useAudio } from './AudioManager';

interface OrthodoxSelectionProps {
  onSelectSubGroup: (subGroup: 'gupaeilbang' | 'odaesega') => void;
  onBack: () => void;
}

// 떠다니는 파티클 (더 천천히, 더 신비롭게)
const FloatingParticles = ({ color, count = 20 }: { color: string; count?: number }) => {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10
    })), [count]
  );

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y + 10}vh`, opacity: 0 }}
          animate={{ 
            y: [`${p.y}vh`, `${p.y - 20}vh`],
            x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 10}vw`],
            opacity: [0, 0.4, 0]
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`
          }}
        />
      ))}
    </div>
  );
};

export default function OrthodoxSelection({ onSelectSubGroup, onBack }: OrthodoxSelectionProps) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const subGroups = [
    {
      id: 'gupaeilbang',
      title: '구파일방',
      hanja: '九派一幇',
      verticalTitle: ['구', '파', '일', '방'],
      desc: '천하의 정의를 수호하는\n아홉 명문정파와 천하제일방',
      color: '#D4AF37',
      factions: '소림사 · 무당파 · 화산파 · 아미파 · 곤륜파 · 점창파 · 공동파 · 청성파 · 종남파 · 개방',
      symbol: '劍'
    },
    {
      id: 'odaesega',
      title: '오대세가',
      hanja: '五大世家',
      verticalTitle: ['오', '대', '세', '가'],
      desc: '대대손손 이어온 가문의\n비전이 곧 천하의 법도',
      color: '#7B9EAE',
      factions: '남궁세가 · 사천당가 · 하북팽가 · 모용세가 · 제갈세가',
      symbol: '家'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0806',
        color: '#e5e5e5'
      }}
    >
      {/* 배경 텍스처 및 미묘한 그라데이션 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 50% 0%, rgba(30, 25, 20, 0.4) 0%, transparent 60%),
          linear-gradient(to bottom, #050403 0%, #110e0c 50%, #050403 100%)
        `,
        pointerEvents: 'none'
      }} />
      
      {/* 마우스 조명 효과 */}
      <motion.div
        animate={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.03), transparent 50%)`
        }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      
      <FloatingParticles color="rgba(180, 160, 120, 0.3)" count={30} />

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => {
          playClick();
          onBack();
        }}
        onMouseEnter={playHover}
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          zIndex: 50,
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-noto-serif-kr)',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}
      >
        <span>←</span> 돌아가기
      </button>

      {/* 메인 컨텐츠 영역 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8vw',
        zIndex: 10
      }}>
        {subGroups.map((group) => (
          <motion.div
            key={group.id}
            onMouseEnter={() => {
              setHoveredGroup(group.id);
              playHover();
            }}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => {
              playClick();
              onSelectSubGroup(group.id as any);
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              width: 'clamp(280px, 25vw, 380px)',
              height: 'clamp(500px, 70vh, 750px)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* 배경 패널 (호버시 밝아짐) */}
            <motion.div
              animate={{
                background: hoveredGroup === group.id 
                  ? 'linear-gradient(180deg, rgba(20, 18, 16, 0.95) 0%, rgba(25, 22, 20, 0.98) 100%)'
                  : 'linear-gradient(180deg, rgba(12, 10, 8, 0.8) 0%, rgba(15, 12, 10, 0.9) 100%)',
                boxShadow: hoveredGroup === group.id 
                  ? `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${group.color}40`
                  : '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
                scale: hoveredGroup === group.id ? 1.02 : 1
              }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '4px', // 각진 느낌
                backdropFilter: 'blur(10px)',
              }}
            />

            {/* 상단/하단 금속 장식 */}
            <div style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '60px',
              background: `linear-gradient(to bottom, transparent, ${group.color}60)`,
            }} />
            <div style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '60px',
              background: `linear-gradient(to top, transparent, ${group.color}60)`,
            }} />

            {/* 거대한 배경 한자 (Watermark) */}
            <motion.div
              animate={{
                opacity: hoveredGroup === group.id ? 0.15 : 0.08,
                scale: hoveredGroup === group.id ? 1.1 : 1,
                y: hoveredGroup === group.id ? -10 : 0
              }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 'clamp(180px, 15vw, 250px)',
                fontFamily: 'var(--font-noto-serif-kr)',
                fontWeight: 900,
                color: group.color,
                pointerEvents: 'none',
                zIndex: 0,
                whiteSpace: 'nowrap'
              }}
            >
              {group.symbol}
            </motion.div>


            {/* 메인 컨텐츠 컨테이너 */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between', // 공간 균등 분배
              height: '100%',
              width: '100%', // 너비 꽉 채우기
              padding: 'clamp(30px, 4vh, 50px) 20px', // 패딩 축소
              textAlign: 'center',
            }}>
              {/* 한자 소제목 */}
              <p style={{
                color: hoveredGroup === group.id ? group.color : 'rgba(255,255,255,0.3)',
                fontSize: '14px',
                letterSpacing: '0.4em',
                fontFamily: 'var(--font-noto-serif-kr)',
                transition: 'color 0.4s',
                marginTop: 0,
                flexShrink: 0
              }}>
                {group.hanja}
              </p>

              {/* 세로 쓰기 타이틀 */}
              <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 'clamp(10px, 1.5vh, 20px)',
                margin: '10px 0',
                padding: '20px 0' // 타이틀 영역 확보
              }}>
                {group.verticalTitle.map((char, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      color: hoveredGroup === group.id ? '#fff' : 'rgba(255,255,255,0.8)',
                      textShadow: hoveredGroup === group.id ? `0 0 20px ${group.color}60` : 'none',
                      y: hoveredGroup === group.id ? -5 : 0
                    }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    style={{
                      fontSize: 'clamp(32px, 3.5vw, 44px)',
                      fontFamily: 'var(--font-noto-serif-kr)',
                      fontWeight: 700,
                      lineHeight: 1
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* 설명 텍스트 그룹 */}
              <motion.div
                animate={{ opacity: hoveredGroup === group.id ? 1 : 0.7 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  alignItems: 'center',
                  flexShrink: 0,
                  width: '100%'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '1px',
                  background: group.color,
                  opacity: 0.5
                }} />
                
                <p style={{
                  fontSize: 'clamp(12px, 1.1vw, 14px)',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-noto-serif-kr)',
                  whiteSpace: 'pre-line',
                  margin: 0
                }}>
                  {group.desc}
                </p>

                {/* 문파 리스트 */}
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  lineHeight: 1.5,
                  maxWidth: '90%',
                  marginTop: 5,
                  wordBreak: 'keep-all'
                }}>
                  {group.factions}
                </p>
              </motion.div>

              {/* 하단 입문하기 영역 */}
              <motion.div
                animate={{
                  opacity: hoveredGroup === group.id ? 1 : 0.4,
                  scale: hoveredGroup === group.id ? 1.05 : 1,
                  borderColor: hoveredGroup === group.id ? group.color : `${group.color}60`
                }}
                style={{
                  marginTop: 'clamp(15px, 2vh, 25px)',
                  padding: '8px 24px',
                  border: '1px solid',
                  color: group.color,
                  fontSize: '13px',
                  letterSpacing: '0.2em',
                  fontFamily: 'var(--font-noto-serif-kr)',
                  transition: 'all 0.3s',
                  flexShrink: 0
                }}
              >
                입문하기
              </motion.div>

            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
