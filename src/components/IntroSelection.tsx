"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioManager";

// 세력 데이터 - 정통 무협 한지 스타일 (은은한 아이보리 톤)
const GROUPS = [
  {
    id: "orthodox",
    title: "정파",
    hanja: "正派",
    desc: "의리와 정의를 수호하는 무림의 기둥",
    subDesc: "구파일방 · 오대세가",
    bgColor: "rgba(25, 28, 32, 0.95)",
    hoverBgColor: "rgba(35, 45, 60, 0.98)",
    accentColor: "rgba(100, 150, 200, 0.85)",
    glowColor: "rgba(80, 130, 180, 0.4)",
    inkColor: "rgba(70, 100, 140, 0.15)",
  },
  {
    id: "unorthodox",
    title: "사파",
    hanja: "邪派",
    desc: "약육강식의 법칙을 따르는 그림자",
    subDesc: "녹림 · 수로채 · 하오문",
    bgColor: "rgba(25, 30, 28, 0.95)",
    hoverBgColor: "rgba(35, 55, 45, 0.98)",
    accentColor: "rgba(100, 170, 120, 0.85)",
    glowColor: "rgba(80, 150, 100, 0.4)",
    inkColor: "rgba(70, 120, 90, 0.15)",
  },
  {
    id: "demonic",
    title: "마교",
    hanja: "魔敎",
    desc: "천마를 숭배하는 마도의 추종자들",
    subDesc: "천마신교 · 혈교 · 살수막",
    bgColor: "rgba(32, 25, 25, 0.95)",
    hoverBgColor: "rgba(55, 35, 35, 0.98)",
    accentColor: "rgba(200, 110, 110, 0.85)",
    glowColor: "rgba(180, 90, 90, 0.4)",
    inkColor: "rgba(140, 70, 70, 0.15)",
  },
  {
    id: "outer",
    title: "세외",
    hanja: "塞外",
    desc: "중원 밖의 신비로운 이방인들",
    subDesc: "북해빙궁 · 남만야수궁",
    bgColor: "rgba(25, 30, 32, 0.95)",
    hoverBgColor: "rgba(35, 50, 60, 0.98)",
    accentColor: "rgba(100, 170, 190, 0.85)",
    glowColor: "rgba(80, 150, 170, 0.4)",
    inkColor: "rgba(70, 120, 140, 0.15)",
  },
  {
    id: "imperial",
    title: "관부",
    hanja: "官府",
    desc: "황제의 칼이자 법의 집행자",
    subDesc: "금의위 · 동창",
    bgColor: "rgba(30, 25, 32, 0.95)",
    hoverBgColor: "rgba(50, 40, 60, 0.98)",
    accentColor: "rgba(160, 130, 190, 0.85)",
    glowColor: "rgba(140, 110, 170, 0.4)",
    inkColor: "rgba(120, 90, 140, 0.15)",
  },
];

interface IntroSelectionProps {
  onSelectGroup: (group: string) => void;
  skipIntro?: boolean; // 외부에서 인트로 건너뛰기 요청
  onBackToMain?: () => void; // 메인 메뉴로 돌아가기
  isLandingMode?: boolean; // 랜딩 인트로 모드 (입장 시 메인메뉴로)
  onLandingEnter?: () => void; // 랜딩 모드에서 입장 시 콜백
}

export default function IntroSelection({ onSelectGroup, skipIntro = false, onBackToMain, isLandingMode = false, onLandingEnter }: IntroSelectionProps) {
  // localStorage에서 인트로를 이미 봤는지 확인 (랜딩 모드일 때는 항상 인트로 표시)
  const [showIntro, setShowIntro] = useState(() => {
    if (isLandingMode) return true; // 랜딩 모드면 항상 인트로 표시
    if (skipIntro) return false;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('introSeen') !== 'true';
    }
    return true;
  });
  const [introPhase, setIntroPhase] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { playHover, playClick } = useAudio();

  // 인트로 애니메이션 시퀀스
  useEffect(() => {
    if (!showIntro) return;
    const timers = [
      setTimeout(() => setIntroPhase(1), 300),
      setTimeout(() => setIntroPhase(2), 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [showIntro]);

  const handleEnter = () => {
    playClick();
    setIntroPhase(4);
    // localStorage에 인트로를 봤다고 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('introSeen', 'true');
    }
    
    // 랜딩 모드일 때는 메인 메뉴로 이동
    if (isLandingMode && onLandingEnter) {
      setTimeout(() => onLandingEnter(), 800);
    } else {
      setTimeout(() => setShowIntro(false), 800);
    }
  };

  // ============================================================
  // 인트로 화면 - 정통 무협 스타일 (컴팩트 레이아웃)
  // ============================================================
  if (showIntro) {
    return (
      <motion.div 
        className="fixed inset-0 z-50"
        initial={{ opacity: 1 }}
        animate={introPhase >= 4 ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ 
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #0a0806 0%, #151210 30%, #1a1510 50%, #151210 70%, #0a0806 100%)',
          overflow: 'hidden'
        }}
      >
        {/* 수묵화 텍스처 배경 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139, 90, 43, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 30% 70%, rgba(80, 50, 30, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 70% 30%, rgba(100, 60, 35, 0.03) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />

        {/* 움직이는 먹 번짐 레이어 */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '60%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(80, 50, 30, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />

        {/* 떨어지는 꽃잎/낙엽 파티클 - 개수 줄임 */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ['-10vh', '110vh'],
              x: [0, Math.sin(i) * 80],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
              opacity: [0, 0.3, 0.3, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              left: `${10 + Math.random() * 80}%`,
              top: 0,
              width: '6px',
              height: '6px',
              background: `rgba(${150 + Math.random() * 50}, ${80 + Math.random() * 40}, ${40 + Math.random() * 30}, 0.5)`,
              borderRadius: '50% 0 50% 0',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* 은은한 빛 기둥 */}
        <motion.div
          animate={{ 
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            height: '50%',
            background: 'linear-gradient(180deg, rgba(200, 150, 100, 0.12) 0%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* 진한 비네팅 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.9)',
          pointerEvents: 'none'
        }} />

        {/* 건너뛰기 버튼 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setShowIntro(false)}
          whileHover={{ color: 'rgba(180, 130, 70, 0.9)', borderColor: 'rgba(180, 130, 70, 0.4)' }}
          style={{
            position: 'absolute',
            top: 'clamp(20px, 3vh, 40px)',
            right: 'clamp(20px, 3vw, 40px)',
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(200, 190, 180, 0.2)',
            color: 'rgba(200, 190, 180, 0.5)',
            fontSize: '0.85rem',
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 100
          }}
        >
          건너뛰기 →
        </motion.button>

        {/* ===== 메인 컨텐츠 - 컴팩트 ===== */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          gap: '0'
        }}>
          
          {/* 상단 한자 장식 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(15px, 3vw, 25px)',
              marginBottom: 'clamp(15px, 3vh, 25px)'
            }}
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 'clamp(40px, 8vw, 70px)' }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{ 
                height: '1px', 
                background: 'linear-gradient(to right, transparent, rgba(180, 130, 70, 0.6))',
              }} 
            />
            <motion.div
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(180, 100, 50, 0.3)',
                  '0 0 40px rgba(180, 100, 50, 0.6)',
                  '0 0 20px rgba(180, 100, 50, 0.3)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                color: 'rgba(180, 100, 50, 0.85)', 
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
                fontFamily: '"Nanum Myeongjo", serif',
                fontWeight: 700
              }}
            >
              武
            </motion.div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 'clamp(40px, 8vw, 70px)' }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{ 
                height: '1px', 
                background: 'linear-gradient(to left, transparent, rgba(180, 130, 70, 0.6))',
              }} 
            />
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{ marginBottom: 'clamp(8px, 1.5vh, 15px)' }}
          >
            <motion.h1
              style={{
                fontSize: 'clamp(2.5rem, 12vw, 7rem)',
                color: '#fef3c7',
                fontFamily: '"Nanum Myeongjo", serif',
                fontWeight: 900,
                letterSpacing: '0.1em',
                margin: 0,
                lineHeight: 1.1,
                textShadow: '0 0 60px rgba(180, 130, 70, 0.5), 0 4px 20px rgba(0,0,0,0.9)'
              }}
            >
              {'이 무림에 낙원은 없다'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1 + i * 0.1, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>

          {/* 한자 서브타이틀 */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            style={{
              fontSize: 'clamp(0.9rem, 3vw, 1.6rem)',
              color: 'rgba(180, 130, 70, 0.55)',
              fontFamily: '"Nanum Myeongjo", serif',
              letterSpacing: '0.4em',
              marginBottom: 'clamp(20px, 4vh, 35px)'
            }}
          >
            江 湖 女 傑 傳
          </motion.p>

          {/* 중앙 장식 */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(10px, 2vw, 16px)',
              marginBottom: 'clamp(20px, 4vh, 35px)'
            }}
          >
            <div style={{ 
              width: 'clamp(60px, 12vw, 100px)', 
              height: '1px', 
              background: 'linear-gradient(to right, transparent, rgba(180, 130, 70, 0.4))' 
            }} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ 
                width: '8px', 
                height: '8px', 
                border: '1px solid rgba(180, 130, 70, 0.5)'
              }} 
            />
            <div style={{ 
              width: 'clamp(60px, 12vw, 100px)', 
              height: '1px', 
              background: 'linear-gradient(to left, transparent, rgba(180, 130, 70, 0.4))' 
            }} />
          </motion.div>

          {/* 부제 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.3 }}
            style={{
              color: 'rgba(220, 200, 180, 0.8)',
              fontSize: 'clamp(0.8rem, 1.8vw, 1.15rem)',
              fontFamily: '"Nanum Myeongjo", serif',
              letterSpacing: '0.2em',
              marginBottom: 'clamp(25px, 5vh, 45px)',
              textAlign: 'center'
            }}
          >
            무림의 여걸들이 펼치는 장대한 서사
          </motion.p>

          {/* 입장 버튼 */}
          <motion.button
            onClick={handleEnter}
            onMouseEnter={() => {
              setIsButtonHovered(true);
              playHover();
            }}
            onMouseLeave={() => setIsButtonHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            whileTap={{ scale: 0.97 }}
            style={{
              position: 'relative',
              padding: 'clamp(14px, 2.5vh, 24px) clamp(40px, 10vw, 80px)',
              border: '2px solid rgba(180, 130, 70, 0.6)',
              background: isButtonHovered 
                ? 'linear-gradient(180deg, rgba(120, 80, 40, 0.5) 0%, rgba(80, 50, 25, 0.4) 100%)'
                : 'linear-gradient(180deg, rgba(80, 50, 30, 0.4) 0%, rgba(50, 30, 15, 0.3) 100%)',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              boxShadow: isButtonHovered 
                ? '0 0 40px rgba(180, 130, 70, 0.5), inset 0 0 25px rgba(180, 130, 70, 0.15)'
                : '0 0 25px rgba(0,0,0,0.6), inset 0 0 15px rgba(180, 130, 70, 0.05)',
              transform: isButtonHovered ? 'scale(1.02)' : 'scale(1)',
              overflow: 'hidden'
            }}
          >
            {/* 코너 장식 */}
            {[
              { top: -5, left: -5 },
              { top: -5, right: -5 },
              { bottom: -5, left: -5 },
              { bottom: -5, right: -5 }
            ].map((pos, i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  ...pos,
                  width: '12px',
                  height: '12px',
                  border: '2px solid rgba(180, 130, 70, 0.8)',
                  borderRadius: '1px',
                  background: 'rgba(180, 130, 70, 0.1)'
                }}
              />
            ))}

            {/* 버튼 텍스트 */}
            <span
              style={{
                position: 'relative',
                zIndex: 10,
                color: '#fef3c7',
                fontSize: 'clamp(1.2rem, 2.8vw, 1.8rem)',
                fontFamily: '"Nanum Myeongjo", serif',
                letterSpacing: '0.5em',
                fontWeight: 700,
                textShadow: '0 0 20px rgba(180, 130, 70, 0.6)'
              }}
            >
              入 場
            </span>

            {/* 검광 효과 - 사선으로 스치듯이 */}
            <motion.div
              animate={{
                x: ['-200%', '600%']
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: [0.4, 0, 0.2, 1],
                repeatDelay: 3.5
              }}
              style={{
                position: 'absolute',
                top: '-30%',
                left: 0,
                width: '35%',
                height: '160%',
                background: 'linear-gradient(105deg, transparent 0%, transparent 25%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.08) 60%, transparent 75%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 5,
                transform: 'skewX(-25deg)',
                filter: 'blur(2px)'
              }}
            />
            
            {/* 잔상 효과 */}
            <motion.div
              animate={{
                x: ['-200%', '600%']
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: [0.4, 0, 0.2, 1],
                repeatDelay: 3.5,
                delay: 0.06
              }}
              style={{
                position: 'absolute',
                top: '-30%',
                left: 0,
                width: '20%',
                height: '160%',
                background: 'linear-gradient(105deg, transparent 0%, transparent 30%, rgba(180,130,70,0.2) 50%, transparent 70%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 4,
                transform: 'skewX(-25deg)',
                filter: 'blur(4px)'
              }}
            />
          </motion.button>

          {/* 안내 문구 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, delay: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              marginTop: 'clamp(18px, 3vh, 28px)',
              color: 'rgba(200, 180, 160, 0.7)',
              fontSize: 'clamp(0.7rem, 1.1vw, 0.9rem)',
              fontFamily: '"Nanum Myeongjo", serif',
              letterSpacing: '0.15em'
            }}
          >
            클릭하여 강호에 입문하시오
          </motion.p>
        </div>

        {/* 하단 장식 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.5 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(15px, 3vh, 25px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span style={{ 
            color: 'rgba(180, 130, 70, 0.3)', 
            fontSize: '10px', 
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.1em' 
          }}>武俠</span>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: '4px', 
              height: '4px', 
              background: 'rgba(180, 130, 70, 0.35)',
              borderRadius: '1px' 
            }} 
          />
          <span style={{ 
            color: 'rgba(180, 130, 70, 0.3)', 
            fontSize: '10px', 
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.1em' 
          }}>世界</span>
        </motion.div>
      </motion.div>
    );
  }

  // ============================================================
  // 아코디언 카드 UI - 정통 무협 세력 선택 화면 (한 화면에 모두 표시)
  // ============================================================
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#0c0a08',
      position: 'relative'
    }}>
      
      {/* 수묵화 배경 텍스처 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30, 25, 20, 1) 0%, rgba(12, 10, 8, 1) 100%),
          radial-gradient(ellipse 40% 40% at 20% 80%, rgba(40, 30, 20, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 40% 40% at 80% 20%, rgba(35, 25, 18, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* 떠다니는 먹 파티클 - 최소화 */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: `${15 + i * 18}%`,
            top: `${45 + (i % 2) * 15}%`,
            width: `${80 + i * 20}px`,
            height: `${80 + i * 20}px`,
            background: 'radial-gradient(circle, rgba(100, 80, 60, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(15px)',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* 상단 헤더 - 컴팩트 */}
      <header style={{
        position: 'relative',
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
        padding: 'clamp(15px, 2.5vh, 25px) clamp(20px, 3vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        {/* 홈 버튼 */}
        {onBackToMain && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onBackToMain}
            whileHover={{ scale: 1.05, borderColor: 'rgba(180, 130, 70, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(200, 190, 180, 0.2)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: 'rgba(200, 190, 180, 0.6)',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </motion.button>
        )}

        {/* 로고 */}
        <div style={{ flex: 1, textAlign: onBackToMain ? 'center' : 'left' }}>
          <h1 style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
            fontFamily: '"Nanum Myeongjo", serif',
            color: '#fef3c7',
            letterSpacing: '0.05em',
            margin: 0,
            textShadow: '0 0 20px rgba(180, 130, 70, 0.4)'
          }}>
            이 무림에 낙원은 없다
          </h1>
          <p style={{
            fontSize: 'clamp(0.55rem, 0.9vw, 0.65rem)',
            color: 'rgba(180, 130, 70, 0.45)',
            letterSpacing: '0.15em',
            marginTop: '4px'
          }}>
            此武林無桃源
          </p>
        </div>
        
        {/* 안내 텍스트 */}
        <motion.p 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            color: 'rgba(200, 180, 160, 0.4)',
            fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.12em',
            width: onBackToMain ? '44px' : 'auto',
            textAlign: onBackToMain ? 'right' : 'left'
          }}
        >
          {!onBackToMain && '세력을 선택하세요'}
        </motion.p>
      </header>

      {/* 아코디언 카드 컨테이너 - flex: 1로 남은 공간 채움 */}
      <div style={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        minHeight: 0
      }}>
        {GROUPS.map((group, index) => {
          const isActive = activeId === group.id;
          const hasActive = activeId !== null;
          
          return (
            <motion.div
              key={group.id}
              style={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRight: index < GROUPS.length - 1 ? '1px solid rgba(120, 100, 80, 0.15)' : 'none',
                flex: isActive ? 4 : 1,
                transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: !isActive && hasActive ? 'brightness(0.6) saturate(0.7)' : 'brightness(1)',
              }}
              onMouseEnter={() => {
                setActiveId(group.id);
                playHover();
              }}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => {
                playClick();
                onSelectGroup(group.id);
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              {/* 한지 텍스처 배경 */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isActive ? group.hoverBgColor : group.bgColor,
                transition: 'background 0.5s ease'
              }} />
              
              {/* 한지 섬유질 패턴 - 노이즈 효과 */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 0.08 : 0.04,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px',
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
                transition: 'opacity 0.5s ease'
              }} />

              {/* 붓 터치 - 수묵 번짐 효과 */}
              <motion.div 
                animate={{ 
                  opacity: isActive ? 0.25 : 0 
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse 120% 80% at 50% 80%, ${group.inkColor} 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} 
              />

              {/* 상단 빛 번짐 - 활성화 시 */}
              <motion.div 
                animate={{ 
                  opacity: isActive ? 0.15 : 0 
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '40%',
                  background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${group.glowColor} 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} 
              />

              {/* 상단 악센트 라인 - 활성화 시 빛남 */}
              <motion.div 
                animate={{ 
                  opacity: isActive ? 0.8 : 0.15,
                  boxShadow: isActive ? `0 0 20px ${group.glowColor}` : 'none'
                }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  zIndex: 20,
                  background: isActive 
                    ? `linear-gradient(90deg, transparent 0%, ${group.accentColor} 20%, ${group.accentColor} 80%, transparent 100%)`
                    : 'rgba(180, 170, 160, 0.3)'
                }}
              />

              {/* 하단 어둠 그라디언트 */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, transparent 50%, rgba(0,0,0,0.7) 100%)',
                pointerEvents: 'none'
              }} />

              {/* 측면 그라디언트 */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '15px',
                background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
                zIndex: 10,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '15px',
                background: 'linear-gradient(-90deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
                zIndex: 10,
                pointerEvents: 'none'
              }} />

              {/* === 비활성 상태: 세로 텍스트 === */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 20,
                      pointerEvents: 'auto'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      {/* 먹물 번짐 효과 */}
                      <motion.div
                        animate={{
                          textShadow: [
                            `0 0 20px ${group.glowColor}, 0 0 40px transparent`,
                            `0 0 30px ${group.glowColor}, 0 0 60px ${group.glowColor}`,
                            `0 0 20px ${group.glowColor}, 0 0 40px transparent`
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ 
                          writingMode: 'vertical-rl',
                          textOrientation: 'upright',
                          fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                          fontFamily: '"Nanum Myeongjo", serif',
                          color: 'rgba(240, 235, 225, 0.9)',
                          letterSpacing: '0.35em',
                          fontWeight: 600
                        }}
                      >
                        {group.title}
                      </motion.div>
                      
                      <div 
                        style={{ 
                          writingMode: 'vertical-rl',
                          textOrientation: 'upright',
                          fontSize: 'clamp(0.7rem, 1.2vw, 0.95rem)',
                          color: 'rgba(200, 190, 180, 0.5)',
                          letterSpacing: '0.25em',
                          marginTop: '15px'
                        }}
                      >
                        {group.hanja}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* === 활성 상태: 상세 정보 (컴팩트) === */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      position: 'absolute',
                      bottom: 'clamp(40px, 8vh, 80px)',
                      left: 'clamp(25px, 4vw, 40px)',
                      right: 'clamp(25px, 4vw, 40px)',
                      zIndex: 20,
                      pointerEvents: 'auto'
                    }}
                  >
                    {/* 배경 한자 워터마크 */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.06, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: 'clamp(-120px, -18vh, -150px)',
                        right: '-20px',
                        fontSize: 'clamp(100px, 18vw, 180px)',
                        fontFamily: '"Nanum Myeongjo", serif',
                        color: 'rgba(200, 190, 180, 1)',
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }}
                    >
                      {group.hanja.charAt(0)}
                    </motion.div>

                    {/* 제목 */}
                    <motion.h2 
                      initial={{ y: 25, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
                        fontFamily: '"Nanum Myeongjo", serif',
                        color: 'rgba(255, 250, 245, 0.98)',
                        fontWeight: 700,
                        marginBottom: 'clamp(8px, 1.5vh, 12px)',
                        margin: 0,
                        textShadow: `0 0 30px ${group.glowColor}, 0 2px 4px rgba(0,0,0,0.5)`
                      }}
                    >
                      {group.title}
                    </motion.h2>

                    {/* 한자 부제 */}
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                        color: group.accentColor,
                        letterSpacing: '0.35em',
                        marginBottom: 'clamp(12px, 2vh, 18px)'
                      }}
                    >
                      {group.hanja}
                    </motion.p>

                    {/* 설명 */}
                    <motion.p 
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                        color: 'rgba(220, 215, 210, 0.8)',
                        maxWidth: '400px',
                        marginBottom: 'clamp(6px, 1vh, 10px)',
                        lineHeight: 1.6,
                        fontFamily: '"Nanum Myeongjo", serif'
                      }}
                    >
                      {group.desc}
                    </motion.p>

                    {/* 하위 세력 */}
                    <motion.p 
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
                        color: 'rgba(180, 175, 170, 0.5)',
                        marginBottom: 'clamp(18px, 3vh, 30px)',
                        letterSpacing: '0.08em'
                      }}
                    >
                      {group.subDesc}
                    </motion.p>

                {/* 입장 버튼 - 한지 스타일 */}
                    <motion.button
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      whileHover={{ 
                        scale: 1.03,
                        borderColor: group.accentColor,
                        boxShadow: `0 0 25px ${group.glowColor}, inset 0 0 15px ${group.glowColor}`
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGroup(group.id);
                      }}
                      style={{
                        position: 'relative',
                        padding: 'clamp(12px, 2vh, 16px) clamp(32px, 6vw, 50px)',
                        border: `1px solid rgba(200, 190, 180, 0.35)`,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                        cursor: 'pointer',
                        transition: 'all 0.4s ease',
                        overflow: 'hidden',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {/* 한지 텍스처 */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.06,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: '100px 100px',
                        pointerEvents: 'none'
                      }} />

                      {/* 코너 장식 - 붓 터치 느낌 */}
                      {[
                        { top: -3, left: -3, borderWidth: '2px 0 0 2px' },
                        { top: -3, right: -3, borderWidth: '2px 2px 0 0' },
                        { bottom: -3, left: -3, borderWidth: '0 0 2px 2px' },
                        { bottom: -3, right: -3, borderWidth: '0 2px 2px 0' }
                      ].map((pos, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            top: pos.top,
                            left: pos.left,
                            right: pos.right,
                            bottom: pos.bottom,
                            width: '10px',
                            height: '10px',
                            borderStyle: 'solid',
                            borderColor: group.accentColor,
                            borderWidth: pos.borderWidth,
                            opacity: 0.7
                          }}
                        />
                      ))}

                      <span style={{
                        position: 'relative',
                        zIndex: 10,
                        color: 'rgba(245, 240, 235, 0.95)',
                        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                        fontFamily: '"Nanum Myeongjo", serif',
                        letterSpacing: '0.3em',
                        fontWeight: 600,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                      }}>
                        입장하기
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 하단 글로우 효과 - 은은하게 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 0.15 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${group.glowColor} 0%, transparent 60%)`
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* 하단 안내 - 컴팩트 */}
      <div style={{
        position: 'relative',
        zIndex: 50,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
        padding: 'clamp(12px, 2vh, 20px)',
        flexShrink: 0
      }}>
        <motion.p 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{
            textAlign: 'center',
            color: 'rgba(180, 170, 160, 0.5)',
            fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.15em'
          }}
        >
          마우스를 올려 세력 정보 확인 · 클릭하여 입장
        </motion.p>
      </div>
    </div>
  );
}
