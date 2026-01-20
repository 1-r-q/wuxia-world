"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAudio } from "./AudioManager";

// 메뉴 아이템 타입
interface MenuItem {
  id: string;
  title: string;
  hanja: string;
  desc: string;
  subDesc: string;
  href?: string;
  onClick?: () => void;
  accentColor: string;
  glowColor: string;
}

interface MainMenuProps {
  onNavigate: (destination: 'factions' | 'realms') => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: "factions",
      title: "세력",
      hanja: "勢力",
      desc: "강호의 세력들을 둘러보다",
      subDesc: "정파 · 사파 · 마교 · 세외 · 관부",
      accentColor: "rgba(180, 130, 70, 0.85)",
      glowColor: "rgba(160, 110, 50, 0.4)",
    },
    {
      id: "realms",
      title: "경지",
      hanja: "境地",
      desc: "무학의 심오한 경지를 살피다",
      subDesc: "삼류에서 현경까지",
      accentColor: "rgba(130, 170, 200, 0.85)",
      glowColor: "rgba(110, 150, 180, 0.4)",
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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

      {/* 떨어지는 꽃잎/낙엽 파티클 */}
      {isMounted && [...Array(10)].map((_, i) => (
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

      {/* 메인 컨텐츠 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px, 10vh, 100px) clamp(30px, 5vw, 60px)',
      }}>
        
        {/* 상단 장식 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(12px, 2.5vw, 20px)',
            marginBottom: 'clamp(10px, 2vh, 18px)'
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
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontSize: 'clamp(1.8rem, 6vw, 3.2rem)',
            color: '#fef3c7',
            fontFamily: '"Nanum Myeongjo", serif',
            fontWeight: 900,
            letterSpacing: '0.1em',
            margin: 0,
            marginBottom: 'clamp(10px, 2vh, 20px)',
            textShadow: '0 0 60px rgba(180, 130, 70, 0.5), 0 4px 20px rgba(0,0,0,0.9)'
          }}
        >
          이 무림에 낙원은 없다
        </motion.h1>

        {/* 한자 서브타이틀 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            fontSize: 'clamp(0.75rem, 2vw, 1.2rem)',
            color: 'rgba(180, 130, 70, 0.55)',
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.3em',
            marginBottom: 'clamp(30px, 6vh, 60px)'
          }}
        >
          此 武 林 無 桃 源
        </motion.p>

        {/* 중앙 장식선 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 2vw, 16px)',
            marginBottom: 'clamp(25px, 5vh, 50px)'
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

        {/* 메뉴 카드들 */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'clamp(20px, 4vw, 50px)',
          justifyContent: 'center',
          alignItems: 'stretch',
          maxWidth: '750px',
          padding: '0 20px'
        }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
              onMouseEnter={() => {
                setActiveId(item.id);
                playHover();
              }}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => {
                playClick();
                onNavigate(item.id as 'factions' | 'realms');
              }}
              style={{
                position: 'relative',
                width: 'clamp(180px, 25vw, 280px)',
                padding: 'clamp(20px, 3vh, 35px) clamp(18px, 2vw, 30px)',
                background: activeId === item.id 
                  ? 'rgba(30, 25, 20, 0.95)' 
                  : 'rgba(20, 18, 15, 0.85)',
                border: `1px solid ${activeId === item.id ? item.accentColor : 'rgba(180, 130, 70, 0.15)'}`,
                cursor: 'pointer',
                transition: 'all 0.5s ease',
                overflow: 'hidden'
              }}
            >
              {/* 호버 시 배경 효과 */}
              <motion.div
                animate={{
                  opacity: activeId === item.id ? 0.15 : 0,
                  scale: activeId === item.id ? 1 : 0.8
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(ellipse at center, ${item.glowColor} 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }}
              />

              {/* 한자 배경 */}
              <motion.div
                animate={{
                  opacity: activeId === item.id ? 0.08 : 0.03,
                  scale: activeId === item.id ? 1.1 : 1
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-15%',
                  transform: 'translateY(-50%)',
                  fontSize: 'clamp(80px, 14vw, 150px)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  fontWeight: 900,
                  color: item.accentColor,
                  pointerEvents: 'none',
                  lineHeight: 1
                }}
              >
                {item.hanja.charAt(0)}
              </motion.div>

              {/* 컨텐츠 */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* 상단 라인 */}
                <motion.div
                  animate={{ width: activeId === item.id ? '60px' : '30px' }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '2px',
                    background: item.accentColor,
                    marginBottom: '20px'
                  }}
                />

                {/* 한자 */}
                <p style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                  color: item.accentColor,
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.3em',
                  marginBottom: '8px',
                  opacity: 0.8
                }}>
                  {item.hanja}
                </p>

                {/* 타이틀 */}
                <h2 style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                  color: activeId === item.id ? '#fef3c7' : 'rgba(254, 243, 199, 0.85)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  marginBottom: '12px',
                  transition: 'color 0.3s ease',
                  textShadow: activeId === item.id 
                    ? `0 0 30px ${item.glowColor}` 
                    : 'none'
                }}>
                  {item.title}
                </h2>

                {/* 설명 */}
                <p style={{
                  fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)',
                  color: activeId === item.id 
                    ? 'rgba(220, 200, 180, 0.9)' 
                    : 'rgba(200, 180, 160, 0.6)',
                  fontFamily: '"Nanum Myeongjo", serif',
                  marginBottom: '8px',
                  transition: 'color 0.3s ease'
                }}>
                  {item.desc}
                </p>

                {/* 서브 설명 */}
                <p style={{
                  fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                  color: item.accentColor,
                  fontFamily: '"Nanum Myeongjo", serif',
                  letterSpacing: '0.1em',
                  opacity: activeId === item.id ? 0.9 : 0.5,
                  transition: 'opacity 0.3s ease'
                }}>
                  {item.subDesc}
                </p>

                {/* 화살표 */}
                <motion.div
                  animate={{
                    x: activeId === item.id ? 10 : 0,
                    opacity: activeId === item.id ? 1 : 0.4
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    color: item.accentColor,
                    fontSize: '1.5rem'
                  }}
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 하단 장식 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          style={{
            marginTop: 'clamp(25px, 5vh, 50px)',
            textAlign: 'center'
          }}
        >
          <p style={{
            fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
            color: 'rgba(180, 130, 70, 0.4)',
            fontFamily: '"Nanum Myeongjo", serif',
            letterSpacing: '0.2em'
          }}>
            무림의 여걸들이 펼치는 장대한 서사
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
